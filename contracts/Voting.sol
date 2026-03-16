// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;

    event VoteCast(address indexed voter, uint256 indexed candidateIndex);

    constructor(string[] memory candidateNames) {
        require(candidateNames.length > 0, "At least one candidate required");

        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    function vote(uint256 candidateIndex) external {
        require(!hasVoted[msg.sender], "You already voted");
        require(candidateIndex < candidates.length, "Invalid candidate index");

        candidates[candidateIndex].voteCount++;
        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender, candidateIndex);
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }
}
