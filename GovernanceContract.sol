// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GovernanceContract {
    struct Candidate {
        string altcoinName;
        uint voteCount;
    }

    struct Voter {
        bool voted;
        uint weight;
        uint[] preferences;
    }

    address public owner;
    Candidate[] public candidates;
    mapping(address => Voter) public voters;
    uint public totalVotes;
    uint public numCandidates;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    event NewCandidate(string altcoinName);
    event VoteCast(address voter, uint[] preferences);
    event ElectionResult(string altcoinName, uint voteCount);

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory _altcoinName) public onlyOwner {
        candidates.push(Candidate({
            altcoinName: _altcoinName,
            voteCount: 0
        }));
        numCandidates++;
        emit NewCandidate(_altcoinName);
    }

    function registerVoter(address voterAddress) public onlyOwner {
        require(!voters[voterAddress].voted, "Voter has already been registered");
        voters[voterAddress] = Voter({
            voted: false,
            weight: 1,
            preferences: new uint[](0)
        });
    }

    function vote(uint[] memory _preferences) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        require(_preferences.length == numCandidates, "Preferences must be set for all candidates.");

        sender.voted = true;
        sender.preferences = _preferences;

        // Record the vote (STV logic can be added here for future vote tallying)
        for (uint i = 0; i < _preferences.length; i++) {
            candidates[_preferences[i]].voteCount += sender.weight;
        }

        totalVotes++;
        emit VoteCast(msg.sender, _preferences);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoterPreferences(address voterAddress) public view returns (uint[] memory) {
        return voters[voterAddress].preferences;
    }

    function tallyVotes() public view returns (string memory winnerName, uint winnerVoteCount) {
        require(totalVotes > 0, "No votes cast yet.");
        uint winningVoteCount = 0;
        string memory winningCandidate;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidate = candidates[i].altcoinName;
            }
        }

        return (winningCandidate, winningVoteCount);
    }
}