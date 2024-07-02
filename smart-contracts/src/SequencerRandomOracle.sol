// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SequencerRandomOracle {
    address owner;

    // Add logic to reveal randoms linearly
    struct Entry {
        string random;
        uint256 timestamp;
        uint256 nextTimestamp;
        bool exists;
    }

    uint8 public TIMEOUT;
    uint8 public PRECOMMIT_DELAY;
    uint256 public lastRevealedTimestamp;

    mapping (uint256 => string) public randoms;
    mapping (uint256 => string) public commitments;

    event RandomRevealed(string random, uint256 timestamp);
    event CommitmentSet(string random, uint256 timestamp);

    error ErrorRandomNotAvailable(uint256 timestamp);
    error ErrorRandomRevealedWithoutCommitment(string random, uint256 timestamp);
    error ErrorRandomRevealedAfterTimeout(string random, uint256 timestamp);
    error ErrorRandomRevealedTwice(string random, uint256 timestamp);
    error ErrorRandomInvalidFormat(string random, uint256 timestamp);

    constructor(uint8 delay, uint8 timeout) {
        owner = msg.sender;
        setPreCommitDelay(delay);
        setTimeout(timeout);
    }

    /**
     * Reveals random at given timestamp
     * Reveals random linearly, it should reveal future randoms if the previous ones where not revealed if a commitment has been posted
     * @param random {string} the random
     * @param timestamp {uint256} the timestamp
     */
    function revealRandom(string calldata random, uint256 timestamp) public {
        // Verify there was a commitment for the timestamp
        if (bytes(commitments[timestamp]).length != 0) {
            revert ErrorRandomRevealedWithoutCommitment(random, timestamp);
        }

        // Verify that the random is 64 bytes long
        if (bytes(random).length != 64) {
            revert ErrorRandomInvalidFormat(random, timestamp);
        }

        // Verify that the random is not set after TIMEOUT
        if (timestamp < block.timestamp - TIMEOUT) {
            revert ErrorRandomRevealedAfterTimeout(random, timestamp);
        }

        // Verify that the random is revelead only once
        if (bytes(randoms[timestamp]).length != 0) {
            revert ErrorRandomRevealedTwice(random, timestamp);
        }

        randoms[timestamp] = random;
        lastRevealedTimestamp = timestamp;

        emit RandomRevealed(random, timestamp);
    }

    /**
     * Sets a commitment for a future timestamp
     * @param commitment {string} the future random commitment
     * @param timestamp {uint256} the timestamp
     */
    function setCommitment(string calldata commitment, uint256 timestamp) public {
        // Verify that the commitment is set at least PRECOMMIT_DELAY blocks before the timestamp
        require(timestamp >= block.timestamp - PRECOMMIT_DELAY, "Commitment should be set at least PRECOMMIT_DELAY blocks before the timestamp");
        commitments[timestamp] = commitment;
    }

    /**
     * Get `random` for a given timestamp. Returns 0 if random is not available.
     * @param timestamp {uint256 timestamp} - timestamp for which random is requested
     */ 
    function unsafeGetRandom(uint256 timestamp) public view returns(string memory) {
        // Check if random is available
        return getRandom(timestamp);
    }

    /**
     * Get `random` for a given timestamp. Reverts if random is not available.
     * @param timestamp {uint256 timestamp} - timestamp for which random is requested
     */ 
    function getRandom(uint256 timestamp) public view returns(string memory) {
        return randoms[timestamp];
    }

    /**
     * Checks if the random is available at a given timestamp. This could be a past or future timestamp
     * @param timestamp {uint256} - timestamp to verify if random is or could be available
     */
    function isRandomAvailable(uint256 timestamp) view public returns (bool) {
        // If there is a random for the specified random then it is available
        if (bytes(randoms[timestamp]).length != 0) {
            return true;
        }

        // If the random string is empty, but the timeout has not passed then the random could be available
        return timestamp < block.timestamp + TIMEOUT;
    }

    /**
     * Set the pre commit delay for which the commitment can be set. Can be set only by the owner
     * @param delay {uint8} - delay in seconds
     */
    function setPreCommitDelay(uint8 delay) internal onlyOwner {
        PRECOMMIT_DELAY = delay;
    }

    /**
     * Set the timeout for which the random can be revealed. Can be set only by the owner
     * @param timeout {uint8} - timeout in seconds
     */
    function setTimeout(uint8 timeout) internal onlyOwner {
        TIMEOUT = timeout;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}

