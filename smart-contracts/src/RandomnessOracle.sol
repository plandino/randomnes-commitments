// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { DrandOracle } from "./DrandOracle.sol";
import { SequencerRandomOracle } from "./SequencerRandomOracle.sol";

contract RandomnessOracle {
    DrandOracle public drandOracle;
    SequencerRandomOracle public sequencerRandomOracle;

    constructor(address _drandOracle, address _sequencerRandomOracle) {
        drandOracle = DrandOracle(_drandOracle);
        sequencerRandomOracle = SequencerRandomOracle(_sequencerRandomOracle);
    }

    /**
     * Get `random` for a given timeStamp. Returns 0 if random is not available.
     * @param timeStamp {uint256 timestamp} - timestamp for which random is requested
     */ 
    function unsafeGetRandom(uint256 timeStamp) public view returns(string memory) {
        // Check if random is available
        return getRandom(timeStamp);
    }

    /**
     * Get `random` for a given timeStamp. Reverts if random is not available.
     * @param timeStamp {uint256 timestamp} - timestamp for which random is requested
     */ 
    function getRandom(uint256 timeStamp) public view returns(string memory) {
        return string.concat(
                drandOracle.getRandom(timeStamp),
                sequencerRandomOracle.getRandom(timeStamp)
            );
    }

    /**
     * Checks if a random will be available at a given timestamp.
     * Verifies that both oracles can provide a random at the given timestamp
     * @param timeStamp {uint256 timestamp} - timestamp to verify
     * @return {bool} - true if random will be available at the given timestamp (previous or future)
     */ 
    function isRandomeAvailable(uint256 timeStamp) public view returns(bool) {
        return drandOracle.isRandomAvailable(timeStamp) && sequencerRandomOracle.isRandomAvailable(timeStamp);
    }
}

