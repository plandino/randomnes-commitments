export const DrandOracleABI = [
    {
      type: "constructor",
      inputs: [
        {
          name: "delay",
          type: "uint8",
          internalType: "uint8"
        },
        {
          name: "timeout",
          type: "uint8",
          internalType: "uint8"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "DELAY",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint8",
          internalType: "uint8"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "DRAND_TIMEOUT",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint8",
          internalType: "uint8"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "getRandom",
      inputs: [
        {
          name: "blockTimeStamp",
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
      name: "owner",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "randoms",
      inputs: [
        {
          name: "",
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
      name: "setDelay",
      inputs: [
        {
          name: "delay",
          type: "uint8",
          internalType: "uint8"
        }
      ],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "setRandom",
      inputs: [
        {
          name: "random",
          type: "string",
          internalType: "string"
        },
        {
          name: "timeStamp",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "setTimeout",
      inputs: [
        {
          name: "timeout",
          type: "uint8",
          internalType: "uint8"
        }
      ],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "unsafeGetRandom",
      inputs: [
        {
          name: "timestamp",
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