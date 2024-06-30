// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { SequencerRandomOracle } from "../src/SequencerRandomOracle.sol";
import { DrandOracle } from "../src/DrandOracle.sol";
import { RandomnessOracle } from "../src/RandomnessOracle.sol";

contract RandomnessOracleTest is Test {
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

    function test_Increment() public pure {
        assertTrue(true);
    }
}
