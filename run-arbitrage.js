require("dotenv").config();
const Web3 = require("web3");
const { ethers } = require("ethers");
const { Address } = require("cluster");
const { Pool } = require("@uniswap/v3-sdk");
const {
    abi: QuoterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

const {
    abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");

const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL),
);
const { IERC20_ABI, IKyberNetworkProxy_ABI } = require("./abis");
const { mainnet: addresses } = require("./addresses");
const { Token } = require("@uniswap/sdk-core");

const provider = new ethers.providers.WebSocketProvider(
    process.env.INFURA_WS_URL,
);

const kyber = new ethers.Contract(
    addresses.kyber.kyberNetworkProxy,
    IKyberNetworkProxy_ABI,
    provider,
);

const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";

const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider,
);

async function getPoolImmutables() {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
        await Promise.all([
            poolContract.factory(),
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.maxLiquidityPerTick(),
        ]);
    return {
        factory,
        token0,
        token1,
        fee,
        tickSpacing,
        maxLiquidityPerTick,
    };
}

async function getPoolState() {
    const [liquidity, slot] = await Promise.all([
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);

    const PoolState = {
        liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
    };

    return PoolState;
}

const AMOUNT_ETH = 100;
const AMOUNT_ETH_WEI = web3.utils.toWei(AMOUNT_ETH.toString());
const RECENT_ETH_PRICE = 230;
const AMOUNT_DAI_WEI = web3.utils.toWei(
    (AMOUNT_ETH * RECENT_ETH_PRICE).toString(),
);

const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

const quoterContract = new ethers.Contract(quoterAddress, QuoterABI, provider);
(async () => {
    web3.eth
        .subscribe("newBlockHeaders")
        .on("data", async (block) => {
            console.log(`------\nBlock Number: ` + block.number);

            const [immutables, state] = await Promise.all([
                getPoolImmutables(),
                getPoolState(),
            ]);

            const DAI = new Token(
                1,
                addresses.tokens.dai,
                6,
                "DAI",
                "DAI Coin",
            );

            const WETH = new Token(
                1,
                addresses.tokens.weth,
                18,
                "WETH",
                "Wrapped Ether",
            );
            const DAI_WETH_POOL = new Pool(
                DAI,
                WETH,
                immutables.fee,
                state.sqrtPriceX96.toString(),
                state.liquidity.toString(),
                state.tick,
            );

            const uniswapPrices = {
                buy: DAI_WETH_POOL.token1Price.toSignificant(6),
                sell: DAI_WETH_POOL.token0Price.toSignificant(6),
            };

            console.log("\nUNISWAP PRICES");
            console.log(uniswapPrices);

            const amountIn = 100000;
            const quotedAmountOut =
                await quoterContract.callStatic.quoteExactInputSingle(
                    immutables.token0,
                    immutables.token1,
                    immutables.fee,
                    amountIn.toString(),
                    0,
                );

            console.log(ethers.utils.formatEther(quotedAmountOut));

            const kyberResults = await Promise.all([
                kyber.getExpectedRate(
                    addresses.tokens.weth,
                    addresses.tokens.dai,
                    1,
                ),
                kyber.getExpectedRate(
                    addresses.tokens.weth,
                    addresses.tokens.dai,
                    1,
                ),
            ]);

            const kyberPrices = {
                buy: ethers.utils.formatEther(kyberResults[0].expectedRate),
                sell:
                    1 / ethers.utils.formatEther(kyberResults[1].expectedRate),
            };
            console.log("\nKYBER PRICES");
            console.log(kyberPrices);
        })
        .on("error", (error) => {
            console.log(error);
        });
})();
