import { fetchBeacon, HttpCachingChain, HttpChainClient } from 'drand-client';
import { Account, Address, Chain, createPublicClient, createWalletClient, decodeEventLog, http, Log, parseEventLogs, PublicClient, Transport, WalletClient } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import secrets from './secrets';
import { DrandOracleABI } from './abis/DrandOracle';
import { privateKeyToAccount } from 'viem/accounts';
import format from 'time-stamp';

const DRAND_ORACLE_ADDRESS = "0x3EF4Bb6eE3aa07af4191df2A53C16E19f9028AeC" // Eth Sepolia
const EXPECTED_BLOCK_CONFIRMATIONS = 3;
const MAX_ATTEMPTS = 3;

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

const DrandChain = new HttpCachingChain('https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971');

const readRandomBeacon = async () => {
  console.log("Reading random beacon from quicknet")
  const client = new HttpChainClient(DrandChain);
  const latestBeacon = await fetchBeacon(client);
  console.log("Retrieved latest random beacon");
  console.log({ latestBeacon });
  return latestBeacon;
};

// Singleton
let walletClient: WalletClient<Transport, Chain, Account>;
const getWalletClient = () => {

  // Return walletClient if it has been initialized
  if (walletClient) {
    return walletClient;
  }

  // Else, initialize walletClient, save it, and return it
  const account = privateKeyToAccount(secrets.PRIVATE_KEY as Address) 

  walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(secrets.RPC_URL)
  });

  return walletClient;
};

// Singleton
let publicClient: PublicClient;
const getPublicClient = () => {

  // Return publicClient if it has been initialized
  if (publicClient) {
    return publicClient;
  }

  // Else, initialize publicClient, save it, and return it
  const account = privateKeyToAccount(secrets.PRIVATE_KEY as Address) 

  publicClient = createPublicClient({
    chain: sepolia,
    transport: http(secrets.RPC_URL)
  });

  return publicClient;
};

const waitForResult = async (txHash: Address) => {
  // Initialize publicClient
  const publicClient = getPublicClient();

  console.log('Gettings transaction receipt');

  // Wait for transaction receipt
  let transactionReceipt = await publicClient.waitForTransactionReceipt( 
    { hash: txHash }
  )

  console.log('Got transaction receipt: ', transactionReceipt);

  console.log('Getting block confirmation');

  // Get the number of confirmations
  let confirmations = await publicClient.getTransactionConfirmations({ transactionReceipt });

  console.log(`Got ${confirmations} confirmations`);

  while(confirmations < EXPECTED_BLOCK_CONFIRMATIONS && transactionReceipt.status === 'success') {
    console.log("Waiting for more confirmations...");
    // Waits for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get the number of confirmations and transactionReceipt status again
    confirmations = await publicClient.getTransactionConfirmations({ transactionReceipt });
    transactionReceipt = await publicClient.waitForTransactionReceipt( 
      { hash: txHash }
    )
    console.log(`Got ${confirmations} confirmations`);
  }

  // If receipt is success and passed enough block confirmation, log success message and return true
  if (confirmations >= EXPECTED_BLOCK_CONFIRMATIONS && transactionReceipt.status === 'success') {
    console.log("Transaction included");
    return true;
  }

  // If receipt is reverted, log error message and return false
  if (transactionReceipt.status === 'reverted') {
    console.error("Failed to write randomness to DrandOracle contract");
    return false;
  }
}

const writeRandom = async ({ randomness, timestamp, attempt = 1 } : { randomness?: string, timestamp?: number, attempt?: number }) => {
  if (attempt > 1) {
    console.log(`Retrying to write ${randomness} for ${timestamp} for time n° ${attempt}`);
  }

  if (!randomness && !timestamp) {
    console.log("Getting random from Drand")
    // Gets random beacon from Drand
    const randomBeacon = await readRandomBeacon();
    const round = randomBeacon.round;
    randomness = randomBeacon.randomness;
  
    const chainInfo = await DrandChain.info();
    
    // Get the timestamp of the current round
    timestamp = roundToTimeStamp(randomBeacon.round, chainInfo.period, chainInfo.genesis_time);
  
    console.log(
      `Got randomness ${randomness} for round ${round} ` +
      `with timestamp: ${timestamp} (${formatTimeStampToDateString(timestamp)})`
    );
  } 

  // Initialize walletClient and write randomness to DrandOracle contract
  const walletClient = getWalletClient();
  const publicClient = getPublicClient();

  console.log("Simulating transaction of writing to DrandOracle contract");

  try {
    await publicClient.simulateContract({
      address: DRAND_ORACLE_ADDRESS,
      abi: DrandOracleABI,
      functionName: 'setRandom',
      args: [randomness, timestamp],
    });
  } catch (error) {
    console.error("Simulation failed. Error: ", error);
    console.error("Breaking process...");
    return;
  }

  console.log("Simulation successful");

  console.log("Writing randomness to DrandOracle contract");

  const txHash = await walletClient.writeContract({
    address: DRAND_ORACLE_ADDRESS,
    abi: DrandOracleABI,
    functionName: 'setRandom',
    args: [randomness, timestamp],
  });

  console.log("Tx Hash: ", txHash);

  const success = await waitForResult(txHash);

  if (success) {
    return console.log("Successfully wrote randomness to DrandOracle contract");
  }

  console.log("Transaction failed.");
  
  if (attempt < MAX_ATTEMPTS) {
    console.log("Retrying for time n° ", attempt + 1);
    return writeRandom({ randomness, timestamp, attempt: attempt + 1 });
  }

  console.log("Max attempts reached, won't try again.");  
}

writeRandom({});
// setInterval(writeRandom, 10000);

// const logs: Log[] = [
//   {
//     address: '0x3ef4bb6ee3aa07af4191df2a53c16e19f9028aec',
//     topics: ["0x1d45fab4053e8b3eab464bf18c981a53cc95dd27f56abba497466a6b0fd23158"],
//     data: '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000006681f480000000000000000000000000000000000000000000000000000000000000004066363833626533363635663537393032353635303739386331656639653064303030306236646335363361346666383462643034643461626161643661616639',
//     blockNumber: BigInt(6221892),
//     transactionHash: '0xcc3bc3424eba2f1354dc760be3038f9d762718318c0a0822dc075d08e93493ba',
//     transactionIndex: 48,
//     blockHash: '0xafd2c8508f3b737dd20a6f466764ef6a1be84a095c06adb7360d8d341362c2e5',
//     logIndex: 96,
//     removed: false
//   }
// ];

// const parsedLogs = parseEventLogs({
//   abi: DrandOracleABI,
//   logs,
// });

// console.log({parsedLogs});
// const log = hexToString('0x1d45fab4053e8b3eab464bf18c981a53cc95dd27f56abba497466a6b0fd23158');
// console.log({log});

// const decodedLog = decodeEventLog({ abi: DrandOracleABI, data: logs[0].data, topics: logs[0].topics });
// console.log({decodedLog});
