import { Address } from 'viem'
import { DrandOracleABI } from './abis/DrandOracleABI';
import { getTransactionConfirmations, simulateContract, waitForTransactionReceipt } from './clients/blockchain/publicClient';
import { DrandChain, readRandomBeacon } from './clients/drandClient';
import { writeContract } from './clients/blockchain/walletClient';
import { formatTimeStampToDateString, roundToTimeStamp } from './utils/date';
import { DRAND_ORACLE_ADDRESS } from './constants/addresses';

const EXPECTED_BLOCK_CONFIRMATIONS = 3;
const MAX_ATTEMPTS = 3;

/**
 * Waits for the transaction result and returns true if the transaction was successful or false if it was reverted
 * @param txHash {Address} transaction hash to wait for
 * @returns {boolean} true if the transaction was successful, false if it was reverted
 */
const waitForResult = async (txHash: Address) => {
  console.log('Gettings transaction receipt');

  // Wait for transaction receipt
  let transactionReceipt = await waitForTransactionReceipt({ txHash })

  console.log('Got transaction receipt: ', transactionReceipt);

  console.log('Getting block confirmation');

  // Get the number of confirmations
  let confirmations = await getTransactionConfirmations({ transactionReceipt });

  console.log(`Got ${confirmations} confirmations`);

  while(confirmations < EXPECTED_BLOCK_CONFIRMATIONS && transactionReceipt.status === 'success') {
    console.log("Waiting for more confirmations...");
    // Waits for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get the number of confirmations and transactionReceipt status again
    confirmations = await getTransactionConfirmations({ transactionReceipt });
    transactionReceipt = await waitForTransactionReceipt({ txHash })
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

/**
 * Writes randomness to DrandOracle contract.
 * Accepts randomness and timestamp as arguments, if not provided, it gets randomness from Drand.
 * If the transaction fails, it retries up to MAX_ATTEMPTS times with the specified randomness and timestamp.
 * @param randomness {string} randomnes to write to the DrandOracle
 * @param timestamp {number} epoch used to write the randomness to the oracle
 * @param attempt {number} attempt number
 */
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

  console.log("Simulating transaction of writing to DrandOracle contract");

  try {
    await simulateContract({
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

  const txHash = await writeContract({
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

setInterval(writeRandom, 3000);

// Write two more functions to write randomness and commitments to the sequencer 
// setInterval(writeRandomnessToSequencerRandomnessOracle, 2000);
// setInterval(writeCommitmentToSequencerRandomnessOracle, 2000);
