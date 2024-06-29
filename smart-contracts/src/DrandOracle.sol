// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

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

    function setRandom(string calldata random, uint256 timeStamp) public {
        randoms[timeStamp] = random;
    }

    function getRandom(uint256 blockTimeStamp) view public returns (string memory) {
        return randoms[blockTimeStamp];
    }

    function currentBlockTimeStamp() view public returns (uint256) {
        return block.timestamp;
    }

    function setDelay(uint8 delay) internal onlyOwner {
        DELAY = delay;
    }

    function setTimeout(uint8 timeout) internal onlyOwner {
        DRAND_TIMEOUT = timeout;
    }

    /**
     * Checks if the random is available at the given timestamp
     * Verifies if the random 
     * @param timeStamp {uint256} - timestamp to verify if random is or could be available
     */
    function isRandomAvailable(uint256 timeStamp) view public returns (bool) {
        // Get the random string from the timestamp
        string memory random = randoms[timeStamp];

        // If there is a random for the specified timestamp then it available
        if (bytes(random).length != 0) {
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

