import { Block } from 'viem'
import { getPublicClient } from './clients/blockchain/publicClient'
import { DrandOracleABI } from './abis/DrandOracleABI';
import { DRAND_ORACLE_ADDRESS } from './constants/addresses';

const publicClient = getPublicClient();

const getRandomFromOracle = async (block: Block) => {
    return await publicClient.readContract({
        address: DRAND_ORACLE_ADDRESS,
        abi: DrandOracleABI,
        functionName: 'unsafeGetRandom',
        args: [block.timestamp],
    })
}

// This script should be in charge of reading the 3 randoms on each block and printing them
publicClient.watchBlocks({
  onBlock: async(block) => {
    console.log(`\nNew block ${block.number}`);
    console.log(`Gettings randomness`);
    const random = await getRandomFromOracle(block);
    console.log(`Randomness is ${random}\n`);
  },
})