// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { SequencerRandomOracle } from 'src/SequencerRandomOracle.sol';

contract SequencerRandomOracleScript is Script {
    uint8 DELAY = 10;
    uint8 TIMEOUT = 10;
    
    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        SequencerRandomOracle sequencerRandomOracle = new SequencerRandomOracle(DELAY, TIMEOUT);
        // sequencerRandomOracle.setRandom("ab123", 42);
        string memory random = sequencerRandomOracle.getRandom(42);
        console.log("random: ", random);
        vm.stopBroadcast();
    }
}