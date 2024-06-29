export const DrandOracleABI = [
    {
        type: "function",
        name: "getRandomness",
        inputs: [],
        outputs: [
        {
            name: "",
            type: "uint256",
            internalType: "uint256"
        }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "randomness",
        inputs: [],
        outputs: [
        {
            name: "",
            type: "uint256",
            internalType: "uint256"
        }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "setRandomness",
        inputs: [
        {
            name: "_randomness",
            type: "uint256",
            internalType: "uint256"
        }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    }
];