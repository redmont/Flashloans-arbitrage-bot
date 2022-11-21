// Contract ABIs and proxy address
const IERC20_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        inputs: [
            { internalType: "address", name: "_owner", type: "address" },
            { internalType: "address", name: "_spender", type: "address" },
        ],
        name: "allowance",
        outputs: [
            { internalType: "uint256", name: "remaining", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_spender", type: "address" },
            { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [
            { internalType: "uint256", name: "balance", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "digits", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "supply", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_from", type: "address" },
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const IKyberNetworkProxy_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "trader",
                type: "address",
            },
            {
                indexed: false,
                internalType: "contract IERC20",
                name: "src",
                type: "address",
            },
            {
                indexed: false,
                internalType: "contract IERC20",
                name: "dest",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "destAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "actualSrcAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "actualDestAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "platformWallet",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "platformFeeBps",
                type: "uint256",
            },
        ],
        name: "ExecuteTrade",
        type: "event",
    },
    {
        inputs: [],
        name: "enabled",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "contract ERC20", name: "src", type: "address" },
            { internalType: "contract ERC20", name: "dest", type: "address" },
            { internalType: "uint256", name: "srcQty", type: "uint256" },
        ],
        name: "getExpectedRate",
        outputs: [
            { internalType: "uint256", name: "expectedRate", type: "uint256" },
            { internalType: "uint256", name: "worstRate", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "contract IERC20", name: "src", type: "address" },
            { internalType: "contract IERC20", name: "dest", type: "address" },
            { internalType: "uint256", name: "srcQty", type: "uint256" },
            {
                internalType: "uint256",
                name: "platformFeeBps",
                type: "uint256",
            },
            { internalType: "bytes", name: "hint", type: "bytes" },
        ],
        name: "getExpectedRateAfterFee",
        outputs: [
            { internalType: "uint256", name: "expectedRate", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "maxGasPrice",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "contract IERC20", name: "src", type: "address" },
            { internalType: "uint256", name: "srcAmount", type: "uint256" },
            { internalType: "contract IERC20", name: "dest", type: "address" },
            {
                internalType: "address payable",
                name: "destAddress",
                type: "address",
            },
            { internalType: "uint256", name: "maxDestAmount", type: "uint256" },
            {
                internalType: "uint256",
                name: "minConversionRate",
                type: "uint256",
            },
            {
                internalType: "address payable",
                name: "platformWallet",
                type: "address",
            },
        ],
        name: "trade",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "contract ERC20", name: "src", type: "address" },
            { internalType: "uint256", name: "srcAmount", type: "uint256" },
            { internalType: "contract ERC20", name: "dest", type: "address" },
            {
                internalType: "address payable",
                name: "destAddress",
                type: "address",
            },
            { internalType: "uint256", name: "maxDestAmount", type: "uint256" },
            {
                internalType: "uint256",
                name: "minConversionRate",
                type: "uint256",
            },
            {
                internalType: "address payable",
                name: "walletId",
                type: "address",
            },
            { internalType: "bytes", name: "hint", type: "bytes" },
        ],
        name: "tradeWithHint",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "contract IERC20", name: "src", type: "address" },
            { internalType: "uint256", name: "srcAmount", type: "uint256" },
            { internalType: "contract IERC20", name: "dest", type: "address" },
            {
                internalType: "address payable",
                name: "destAddress",
                type: "address",
            },
            { internalType: "uint256", name: "maxDestAmount", type: "uint256" },
            {
                internalType: "uint256",
                name: "minConversionRate",
                type: "uint256",
            },
            {
                internalType: "address payable",
                name: "platformWallet",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "platformFeeBps",
                type: "uint256",
            },
            { internalType: "bytes", name: "hint", type: "bytes" },
        ],
        name: "tradeWithHintAndFee",
        outputs: [
            { internalType: "uint256", name: "destAmount", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
    },
];

// Kyber Network Proxy Contract Address
const IKyberNetworkProxy_ADDRESS = "0xa16Fc6e9b5D359797999adA576F7f4a4d57E8F75";
module.exports = {
    IERC20_ABI,
    IKyberNetworkProxy_ABI,
};
