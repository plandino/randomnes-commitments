// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { SequencerRandomOracle } from "../src/SequencerRandomOracle.sol";

contract SequencerRandomOracleTest is Test {
    SequencerRandomOracle sequencerRandomOracle;
    uint8 DELAY = 10;
    uint8 TIMEOUT = 10;

    function setUp() public {
        sequencerRandomOracle = new SequencerRandomOracle(DELAY, TIMEOUT);
    }

    function test_Increment() public pure {
        assertTrue(true);
    }
}
