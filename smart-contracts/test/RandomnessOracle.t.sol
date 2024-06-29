// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { RandomnessOracle } from "../src/RandomnessOracle.sol";

contract RandomnessOracleTest is Test {
    RandomnessOracle public randomnessOracle;

    function setUp() public {
        randomnessOracle = new RandomnessOracle();
    }

    function test_Increment() public {
        randomnessOracle.setRandomness();
        assertEq(randomnessOracle.getRandomness(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        randomnessOracle.setRandomness(x);
        assertEq(randomnessOracle.getRandomness(), x);
    }
}
