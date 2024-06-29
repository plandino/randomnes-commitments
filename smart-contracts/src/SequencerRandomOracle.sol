// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SequencerRandomOracle {
    address owner;
    uint8 public TIMEOUT;
    uint8 public PRECOMMIT_DELAY;
    mapping (uint256 => string) public randoms;
    mapping (uint256 => string) public commitments;

    constructor(uint8 delay, uint8 timeout) {
        owner = msg.sender;
        setPreCommitDelay(delay);
        setTimeout(timeout);
    }

    /**
     * Reveals random at given timestamp
     * Reveals random linearly, it should reveal future randoms if the previous ones where not revealed if a commitment has been posted
     * @param random {string} the random
     * @param timeStamp {uint256} the timestamp
     */
    function revealRandom(string calldata random, uint256 timeStamp) public {
        // Verify that the random is revelead before the timeout
        require(timeStamp < block.timestamp + TIMEOUT, "Random should be revealed before timeout");
        randoms[timeStamp] = random;
    }

    /**
     * Sets a commitment for a future timestamp
     * @param commitment {string} the future random commitment
     * @param timeStamp {uint256} the timestamp
     */
    function setCommitment(string calldata commitment, uint256 timeStamp) public {
        // Verify that the commitment is set at least PRECOMMIT_DELAY blocks before the timestamp
        require(timeStamp >= block.timestamp + PRECOMMIT_DELAY, "Commitment should be set at least PRECOMMIT_DELAY blocks before the timestamp");
        commitments[timeStamp] = commitment;
    }

    /**
     * Get `random` for a given timeStamp. Returns 0 if random is not available.
     * @param timeStamp {uint256 timestamp} - timestamp for which random is requested
     */ 
    function unsafeGetRandom(uint256 timeStamp) public view returns(string memory) {
        // Check if random is available
        return getRandom(timeStamp);
    }

    /**
     * Get `random` for a given timeStamp. Reverts if random is not available.
     * @param timeStamp {uint256 timestamp} - timestamp for which random is requested
     */ 
    function getRandom(uint256 timeStamp) public view returns(string memory) {
        return randoms[timeStamp];
    }

    function isRandomeAvailable(uint256 timeStamp) view public returns (bool) {
        // Get the random string from the timestamp
        string memory random = randoms[timeStamp];

        // If there is a random for the specified random then it is available
        if (bytes(random).length != 0) {
            return true;
        }

        // If the random string is empty, but the timeout has not passed then the random could be available
        return timeStamp < block.timestamp + TIMEOUT;
    }

    function setPreCommitDelay(uint8 delay) internal onlyOwner {
        PRECOMMIT_DELAY = delay;
    }

    function setTimeout(uint8 timeout) internal onlyOwner {
        TIMEOUT = timeout;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}

