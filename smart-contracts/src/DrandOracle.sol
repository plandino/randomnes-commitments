// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import { console } from "forge-std/Console.sol";

contract DrandOracle {
    address public owner;
    uint8 public DRAND_TIMEOUT;
    uint8 public DELAY;
    mapping (uint256 => string) public randoms;

    constructor(uint8 delay, uint8 timeout) {
        owner = msg.sender;
        setDelay(delay);
        setTimeout(timeout);
    }

    /**
     * Sets random at given timestamp
     * Random can be set only once and cannot be set after TIMEOUT and DELAY
     * @param random {string} the random which should be 64 bytes long
     * @param timeStamp {uint256} the timestamp
     */
    function setRandom(string calldata random, uint256 timeStamp) public {
        // Verify that the random is 64 bytes long
        require(bytes(random).length == 64, "Random should be 64 bytes long");
        // Verify that the random is not set after TIMEOUT and DELAY
        require(timeStamp < block.timestamp + DRAND_TIMEOUT + DELAY, "Random should be set before timeout and delay");
        // Verify that the random is not set twice
        require(bytes(randoms[timeStamp]).length == 0, "Random can not be set twice");
        randoms[timeStamp] = random;
    }

    /**
     * Returns the random for the given timestamp. Reverts if random is not available.
     * Reverts if random is not available.
     * @param blockTimeStamp {uint256} - timestamp for which random is requested
     */
    function getRandom(uint256 blockTimeStamp) view public returns (string memory) {
        require(bytes(randoms[blockTimeStamp]).length != 0, "Random not available");
        return randoms[blockTimeStamp];
    }

    /**
     * Returns the random for the given timestamp. Returns 0 if the random is not available.
     * @param timestamp {uint256} - timestamp for which random is requested
     */
    function unsafeGetRandom(uint256 timestamp) view public returns (string memory) {
        return randoms[timestamp];
    }

    /**
     * Set the delay for which the random can be set. Can be set only by the owner
     * @param delay {uint8} - delay in seconds
     */
    function setDelay(uint8 delay) public onlyOwner {
        DELAY = delay;
    }

    /**
     * Set the timeout for which the random can be set. Can be set only by the owner
     * @param timeout {uint8} - timeout in seconds
     */
    function setTimeout(uint8 timeout) public onlyOwner {
        DRAND_TIMEOUT = timeout;
    }

    /**
     * Checks if the random is available at a given timestamp. This could be a past or future timestamp
     * @param timeStamp {uint256} - timestamp to verify if random is or could be available
     */
    function isRandomAvailable(uint256 timeStamp) view public returns (bool) {
        // If there is a random for the specified timestamp then it available
        if (bytes(randoms[timeStamp]).length != 0) {
            return true;
        }

        // If the random string is empty, and DRAND_TIMEOUT and DELAY has passed then the random is expired
        return timeStamp < block.timestamp + DRAND_TIMEOUT + DELAY;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}

