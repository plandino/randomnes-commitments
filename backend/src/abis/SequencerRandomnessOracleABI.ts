export const SequencerRandomnessOracleABI = [
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
      name: "PRECOMMIT_DELAY",
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
      name: "TIMEOUT",
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
      name: "commitments",
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
      name: "revealRandom",
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
      name: "setCommitment",
      inputs: [
        {
          name: "commitment",
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
]