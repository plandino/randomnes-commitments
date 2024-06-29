// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { DrandOracle } from "../src/DrandOracle.sol";

contract DrandOracleTest is Test {
    DrandOracle public drandOracle;

    function setUp() public {
        drandOracle = new DrandOracle();
    }

    function test_Increment() public {
        drandOracle.setRandomness();
        assertEq(drandOracle.getRandomness(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        drandOracle.setRandomness(x);
        assertEq(drandOracle.getRandomness(), x);
    }
}
