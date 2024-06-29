// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { RandomnessOracle } from 'src/RandomnessOracle.sol';

contract RandomnessOracleScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        RandomnessOracle randomnessOracle = new RandomnessOracle();
        randomnessOracle.setRandomness("ab123", 42);
        string memory random = randomnessOracle.getRandomness(42);
        console.log("random: ", random);
        vm.stopBroadcast();
    }
}