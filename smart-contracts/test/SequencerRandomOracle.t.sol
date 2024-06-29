// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { SequencerRandomOracle } from "../src/SequencerRandomOracle.sol";

contract SequencerRandomOracleTest is Test {
    SequencerRandomOracle public sequencerRandomOracle;

    function setUp() public {
        sequencerRandomOracle = new SequencerRandomOracle();
    }

    function test_Increment() public {
        sequencerRandomOracle.setRandomness();
        assertEq(sequencerRandomOracle.getRandomness(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        sequencerRandomOracle.setRandomness(x);
        assertEq(sequencerRandomOracle.getRandomness(), x);
    }
}
