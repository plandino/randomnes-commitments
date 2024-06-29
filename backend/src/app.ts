import { fetchBeacon, HttpCachingChain, HttpChainClient } from 'drand-client';
import { Address, createPublicClient, createWalletClient, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import express from 'express';
import secrets from './secrets';
import { DrandOracleABI } from './abis/DrandOracle';
import { privateKeyToAccount } from 'viem/accounts';
import { randomBytes } from 'crypto';
import format from 'time-stamp';


const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const chain = new HttpCachingChain('https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971');
  const chainInfo = await chain.info();
  const client = new HttpChainClient(chain);
  const latestBeacon = await fetchBeacon(client);

  const account = privateKeyToAccount(secrets.PRIVATE_KEY as Address) 

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(secrets.RPC_URL)
  })

  // const result = await walletClient.writeContract({
  //   address: '0x69d5C1A1991173bE7736AEee722020329645d2a4',
  //   abi: DrandOracleABI,
  //   functionName: 'setRandomness',
  //   args: [69420],
  // });

  // console.log(result);

  // const sequencerRandom = randomBytes(32).toString('hex');
  const currentRoundTimeStamp = roundToTimeStamp(latestBeacon.round, chainInfo.period, chainInfo.genesis_time);
  // const genesisRound = timeStampToRound(chainInfo.genesis_time, chainInfo.period);

  // res.send(`The latest beacon is ${latestBeacon.randomness} and my random is ${sequencerRandom}`);
  res.send(`The latest round ${latestBeacon.round} has a timestamp of ${currentRoundTimeStamp} (${formatTimeStampToDateString(currentRoundTimeStamp)}) \n` +
           `and the genesis round ${0} has a timestamp of ${chainInfo.genesis_time} (${formatTimeStampToDateString(chainInfo.genesis_time)})`);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

const timeStampToRound = (genesisTimeStamp: number, period: number) => {
  // Get the current epoch time in milliseconds
  const currentEpochMilliseconds: number = Date.now();
  // Convert the current epoch time to seconds
  const currenTimeStamp = Math.floor(currentEpochMilliseconds / 1000);

  // Calculates current round
  return Math.floor((currenTimeStamp - genesisTimeStamp) / period);
}

// Converts a round to a timestamp 
const roundToTimeStamp = (round: number, period: number, genesisTimeStamp: number) => {
  return Math.floor(round * period + genesisTimeStamp);
}

const formatTimeStampToDateString = (timeStamp: number) => {
  const date = new Date(timeStamp * 1000);
  return format('YYYY/MM/DD HH:mm:ss', date);
}