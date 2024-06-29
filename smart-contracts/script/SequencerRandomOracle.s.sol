// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { SequencerRandomOracle } from 'src/SequencerRandomOracle.sol';

contract SequencerRandomOracleScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        SequencerRandomOracle sequencerRandomOracle = new SequencerRandomOracle();
        sequencerRandomOracle.setRandomness("ab123", 42);
        string memory random = sequencerRandomOracle.getRandomness(42);
        console.log("random: ", random);
        vm.stopBroadcast();
    }
}