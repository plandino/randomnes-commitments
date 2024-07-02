export const RandomnessOracleABI = [
    {
      type: "constructor",
      inputs: [
        {
          name: "_drandOracle",
          type: "address",
          internalType: "address"
        },
        {
          name: "_sequencerRandomOracle",
          type: "address",
          internalType: "address"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "drandOracle",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract DrandOracle"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "getRandom",
      inputs: [
        {
          name: "timeStamp",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "string",
          internalType: "string"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "isRandomAvailable",
      inputs: [
        {
          name: "timeStamp",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "sequencerRandomOracle",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract SequencerRandomOracle"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "unsafeGetRandom",
      inputs: [
        {
          name: "timeStamp",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "string",
          internalType: "string"
        }
      ],
      stateMutability: "view"
    }
];