# Randomness Commitments

Writes commitments and randomnesses to an on-chain oracle. It is composed of two parts:

- `DrandOracle`, `SequencerRandomOracle` and `RandomnessOracle` which receive and store the randoms on-chain.
- A backend which computes some randoms and the commitments to them and posts them to the Oracles. It gets some randoms from [Drand](https://drand.love/)

## How to run the backend

1. Install dependencies:

    `cd backend && yarn install`

2. Copy the `.env.example` in the monorepo root folder to `.env` (also in monorepo root folder) and fill with your own `RPC_URL` and `PRIVATE_KEY`.

> ❗ The **RPC_URL** should target Ethereum Sepolia and the **PRIVATE_KEY** wallet should have some test ETH to post the transactions to the blockchin.

3. Run script that writes randoms to the DrandOracle

    `yarn dev`

4. In another terminarl run script that reads the randoms from the blockchain.

    `yarn dev_listener`

The backend already has an address of the DrandOracle deployed on Ethereum Sepolia.
## How to run the smart contracts

1. Install dependencies:

    `cd smart-contracts && yarn install`

2. Set the env vars

    `export $PRIVATE_KEY=*** (your private key)`
    `export $RPC_URL=***      (your rpc url key)`

2. Deploy the DrandOracle:

    `forge script script/DrandOracle.s.sol --private-key $PRIVATE_KEY --fork-url $RPC_URL --broadcast`

3. (optional) Run tests 

    `forge test`


