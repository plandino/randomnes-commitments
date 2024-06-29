// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { DrandOracle } from 'src/DrandOracle.sol';

contract DrandOracleScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        DrandOracle drandOracle = new DrandOracle();
        drandOracle.setRandomness("ab123", 42);
        string memory random = drandOracle.getRandomness(42);
        console.log("random: ", random);
        vm.stopBroadcast();
    }
}