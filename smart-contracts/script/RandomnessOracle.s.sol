// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { RandomnessOracle } from 'src/RandomnessOracle.sol';
import { DrandOracle } from 'src/DrandOracle.sol';
import { SequencerRandomOracle } from 'src/SequencerRandomOracle.sol';

contract RandomnessOracleScript is Script {
    DrandOracle drandOracle;    
    SequencerRandomOracle sequencerRandomOracle;
    RandomnessOracle randomnessOracle;
    uint8 DELAY = 10;
    uint8 TIMEOUT = 10;

    function setUp() public {
        drandOracle = new DrandOracle(DELAY, TIMEOUT);
        sequencerRandomOracle = new SequencerRandomOracle(DELAY, TIMEOUT);
        randomnessOracle = new RandomnessOracle(address(drandOracle), address(sequencerRandomOracle));
    }


    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        // randomnessOracle.setRandom("ab123", 42);
        string memory random = randomnessOracle.getRandom(42);
        console.log("random: ", random);
        vm.stopBroadcast();
    }
}