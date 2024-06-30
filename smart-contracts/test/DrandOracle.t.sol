// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { DrandOracle } from "../src/DrandOracle.sol";

contract DrandOracleTest is Test {
    DrandOracle drandOracle;
    uint8 DELAY = 10;
    uint8 TIMEOUT = 10;
    uint256 validTimestamp;
    string validRandom;

    function setUp() public {
        drandOracle = new DrandOracle(DELAY, TIMEOUT);
        validTimestamp = block.timestamp + 5;
        validRandom = "96251444dd653d2976369504b1d07b334aca2a4994b8463e9f754e5ce052762b";
    }

    function test_SetValidRandom() public {
        // Set up
        drandOracle.setRandom(validRandom, validTimestamp);

        // Verify
        assertEq(drandOracle.getRandom(validTimestamp), validRandom);
    }
    
    function test_SetInvalidRandomReverts() public {
        // Set up
        string memory random = "abc";

        // Verify it reverts when random is not 64 bytes long
        vm.expectRevert("Random should be 64 bytes long");
        drandOracle.setRandom(random, validTimestamp);
    }

    function test_SetRandomTwiceReverts() public {
        // Set up
        drandOracle.setRandom(validRandom, validTimestamp);

        // Verify it reverts when random is set twice
        vm.expectRevert("Random can not be set twice");
        drandOracle.setRandom(validRandom, validTimestamp);
    }

    function test_GetRandomAtValidtimestamp() public {
        // Set up
        drandOracle.setRandom(validRandom, validTimestamp);

        // Verify
        assertEq(drandOracle.getRandom(validTimestamp), validRandom);
    }

    function test_GetRandomAtInvalidTimestampReverts(uint256 anothertimestamp) public {
        // Set up
        drandOracle.setRandom(validRandom, validTimestamp);

        // If the fuzziness uses the same timestamps, return true
        if (validTimestamp == anothertimestamp) {
            return assertTrue(true);
        }

        // Verify it reverts when timestamp is invalid
        vm.expectRevert("Random not available");
        drandOracle.getRandom(anothertimestamp);
    }
}
