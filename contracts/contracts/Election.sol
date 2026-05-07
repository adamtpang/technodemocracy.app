// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PartyRegistry.sol";
import "./MembershipNFT.sol";
import "./Cabinet.sol";

/**
 * @title Election
 * @notice Periodic president elections. Default 1-year term. Cabinet
 *         ElectionScheduler can call early; otherwise term must expire.
 *         Winner is pushed to PartyRegistry.setPresident.
 */
contract Election {
    struct Race {
        uint256 partyId;
        uint256 startTime;
        uint256 endTime;
        address[] candidates;
        mapping(address => uint256) voteCounts;
        mapping(address => bool) isCandidate;
        mapping(address => bool) hasVoted;
        address winner;
        bool finalized;
    }

    PartyRegistry public registry;
    MembershipNFT public membership;
    Cabinet public cabinet;

    uint256 public constant DEFAULT_TERM = 365 days;

    mapping(uint256 => uint256) public lastElectionAt;
    mapping(uint256 => Race) private _races;
    uint256 public raceCount;
    mapping(uint256 => uint256) public activeRace;

    event ElectionScheduled(
        uint256 indexed raceId,
        uint256 indexed partyId,
        uint256 startTime,
        uint256 endTime
    );
    event CandidacyDeclared(
        uint256 indexed raceId,
        address indexed candidate
    );
    event ElectionVoteCast(
        uint256 indexed raceId,
        address indexed voter,
        address indexed candidate
    );
    event ElectionFinalized(
        uint256 indexed raceId,
        uint256 indexed partyId,
        address winner,
        uint256 voteCount
    );

    error NotMember();
    error AlreadyVoted();
    error AlreadyCandidate();
    error NotCandidate();
    error NoActiveRace();
    error RaceAlreadyActive();
    error RaceNotEnded();
    error RaceAlreadyFinalized();
    error RaceClosed();
    error TermNotExpired();

    constructor(address _registry, address _membership, address _cabinet) {
        require(_registry != address(0), "Election: zero registry");
        require(_membership != address(0), "Election: zero membership");
        require(_cabinet != address(0), "Election: zero cabinet");

        registry = PartyRegistry(_registry);
        membership = MembershipNFT(_membership);
        cabinet = Cabinet(_cabinet);
    }

    function scheduleElection(
        uint256 _partyId,
        uint256 _duration
    ) external returns (uint256 raceId) {
        if (activeRace[_partyId] != 0) revert RaceAlreadyActive();

        bool authorized = cabinet.hasPower(
            _partyId,
            msg.sender,
            Cabinet.Power.ElectionScheduler
        );
        if (!authorized) {
            uint256 last = lastElectionAt[_partyId];
            uint256 termStart = last == 0 ? _founderTermStart(_partyId) : last;
            if (block.timestamp < termStart + DEFAULT_TERM)
                revert TermNotExpired();
        }

        raceCount += 1;
        raceId = raceCount;
        Race storage r = _races[raceId];
        r.partyId = _partyId;
        r.startTime = block.timestamp;
        r.endTime = block.timestamp + _duration;

        activeRace[_partyId] = raceId;
        emit ElectionScheduled(raceId, _partyId, r.startTime, r.endTime);
    }

    function _founderTermStart(
        uint256 _partyId
    ) internal view returns (uint256) {
        return registry.partyFoundedAt(_partyId);
    }

    function declareCandidacy(uint256 _raceId) external {
        Race storage r = _races[_raceId];
        if (r.endTime == 0) revert NoActiveRace();
        if (block.timestamp > r.endTime) revert RaceClosed();
        if (!membership.isMember(r.partyId, msg.sender)) revert NotMember();
        if (r.isCandidate[msg.sender]) revert AlreadyCandidate();

        r.isCandidate[msg.sender] = true;
        r.candidates.push(msg.sender);
        emit CandidacyDeclared(_raceId, msg.sender);
    }

    function castElectionVote(
        uint256 _raceId,
        address _candidate
    ) external {
        Race storage r = _races[_raceId];
        if (r.endTime == 0) revert NoActiveRace();
        if (block.timestamp > r.endTime) revert RaceClosed();
        if (!membership.isMember(r.partyId, msg.sender)) revert NotMember();
        if (r.hasVoted[msg.sender]) revert AlreadyVoted();
        if (!r.isCandidate[_candidate]) revert NotCandidate();

        r.hasVoted[msg.sender] = true;
        r.voteCounts[_candidate] += 1;

        emit ElectionVoteCast(_raceId, msg.sender, _candidate);
    }

    function finalize(uint256 _raceId) external {
        Race storage r = _races[_raceId];
        if (r.endTime == 0) revert NoActiveRace();
        if (block.timestamp <= r.endTime) revert RaceNotEnded();
        if (r.finalized) revert RaceAlreadyFinalized();

        address winner;
        uint256 best;
        for (uint256 i = 0; i < r.candidates.length; i++) {
            address c = r.candidates[i];
            if (r.voteCounts[c] > best) {
                best = r.voteCounts[c];
                winner = c;
            }
        }

        r.finalized = true;
        r.winner = winner;
        lastElectionAt[r.partyId] = block.timestamp;
        activeRace[r.partyId] = 0;

        if (winner != address(0)) {
            registry.setPresident(r.partyId, winner);
        }

        emit ElectionFinalized(_raceId, r.partyId, winner, best);
    }

    function getCandidates(
        uint256 _raceId
    ) external view returns (address[] memory) {
        return _races[_raceId].candidates;
    }

    function getVoteCount(
        uint256 _raceId,
        address _candidate
    ) external view returns (uint256) {
        return _races[_raceId].voteCounts[_candidate];
    }

    function raceInfo(
        uint256 _raceId
    )
        external
        view
        returns (
            uint256 partyId,
            uint256 startTime,
            uint256 endTime,
            uint256 candidateCount,
            address winner,
            bool finalized
        )
    {
        Race storage r = _races[_raceId];
        return (
            r.partyId,
            r.startTime,
            r.endTime,
            r.candidates.length,
            r.winner,
            r.finalized
        );
    }
}
