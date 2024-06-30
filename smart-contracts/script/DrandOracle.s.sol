// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { DrandOracle } from 'src/DrandOracle.sol';

contract DrandOracleScript is Script {
    uint8 public TIMEOUT = 10;
    uint8 public DELAY = 10;


    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        DrandOracle drandOracle = new DrandOracle(DELAY, TIMEOUT);
        drandOracle.setRandom("96251444dd653d2976369504b1d07b334aca2a4994b8463e9f754e5ce052762b", 42);
        string memory random = drandOracle.getRandom(42);
        console.log("random: ", random);
        string memory randomTwo = drandOracle.getRandom(40);
        console.log("randomTwo: ", randomTwo);
        vm.stopBroadcast();
    }
}