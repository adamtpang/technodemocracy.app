// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./HouseRegistry.sol";

contract HouseVoting {
    // ---------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------

    struct Proposal {
        uint256 houseId;
        string title;
        bytes32 descriptionHash;
        address creator;
        uint256 startTime;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
    }

    // ---------------------------------------------------------------
    // State
    // ---------------------------------------------------------------

    HouseRegistry public registry;

    /// @notice Admin address (same as registry deployer).
    address public admin;

    Proposal[] public proposals;

    /// @notice proposalId => voter => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    /// @notice houseId => voter => candidate they voted for
    mapping(uint256 => mapping(address => address)) public leaderVotes;

    /// @notice houseId => candidate => total vote count
    mapping(uint256 => mapping(address => uint256)) public leaderVoteCounts;

    /// @notice Contracts authorized to create proposals on behalf of members.
    mapping(address => bool) public authorizedCallers;

    // ---------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------

    event ProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed houseId,
        string title
    );

    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        bool support
    );

    event LeaderVoteChanged(
        address indexed voter,
        uint256 indexed houseId,
        address newLeader
    );

    // ---------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------

    /// @param _registry  Address of the deployed HouseRegistry contract.
    constructor(address _registry) {
        require(
            _registry != address(0),
            "HouseVoting: zero registry address"
        );
        registry = HouseRegistry(_registry);
        admin = msg.sender;
    }

    // ---------------------------------------------------------------
    // Admin functions
    // ---------------------------------------------------------------

    /// @notice Authorize a contract (e.g. HouseTreasury) to create proposals
    ///         on behalf of house members.
    function setAuthorizedCaller(
        address _caller,
        bool _authorized
    ) external {
        require(msg.sender == admin, "HouseVoting: caller is not admin");
        authorizedCallers[_caller] = _authorized;
    }

    // ---------------------------------------------------------------
    // Proposal functions
    // ---------------------------------------------------------------

    /// @notice Create a new proposal for a house.
    /// @param _houseId         The house this proposal belongs to.
    /// @param _title           Human-readable title.
    /// @param _descriptionHash IPFS CID hash or keccak256 of off-chain text.
    /// @param _duration        Voting window in seconds.
    /// @return proposalId      The index of the newly created proposal.
    function createProposal(
        uint256 _houseId,
        string calldata _title,
        bytes32 _descriptionHash,
        uint256 _duration
    ) external returns (uint256 proposalId) {
        require(
            registry.getMemberHouse(msg.sender) == _houseId && _houseId != 0,
            "HouseVoting: caller not member of this house"
        );
        return _createProposal(_houseId, _title, _descriptionHash, _duration, msg.sender);
    }

    /// @notice Create a proposal on behalf of a member.  Only callable by
    ///         contracts that have been authorized via setAuthorizedCaller.
    /// @param _houseId         The house this proposal belongs to.
    /// @param _title           Human-readable title.
    /// @param _descriptionHash IPFS CID hash or keccak256 of off-chain text.
    /// @param _duration        Voting window in seconds.
    /// @param _onBehalfOf      The member address on whose behalf the proposal
    ///                         is created.  Must be a member of _houseId.
    /// @return proposalId      The index of the newly created proposal.
    function createProposalOnBehalf(
        uint256 _houseId,
        string calldata _title,
        bytes32 _descriptionHash,
        uint256 _duration,
        address _onBehalfOf
    ) external returns (uint256 proposalId) {
        require(
            authorizedCallers[msg.sender],
            "HouseVoting: caller not authorized"
        );
        require(
            registry.getMemberHouse(_onBehalfOf) == _houseId && _houseId != 0,
            "HouseVoting: target not member of this house"
        );
        return _createProposal(_houseId, _title, _descriptionHash, _duration, _onBehalfOf);
    }

    /// @dev Internal helper to push a proposal.
    function _createProposal(
        uint256 _houseId,
        string calldata _title,
        bytes32 _descriptionHash,
        uint256 _duration,
        address _creator
    ) internal returns (uint256 proposalId) {
        require(_duration > 0, "HouseVoting: duration must be > 0");

        proposals.push(
            Proposal({
                houseId: _houseId,
                title: _title,
                descriptionHash: _descriptionHash,
                creator: _creator,
                startTime: block.timestamp,
                endTime: block.timestamp + _duration,
                yesVotes: 0,
                noVotes: 0,
                executed: false
            })
        );

        proposalId = proposals.length - 1;
        emit ProposalCreated(proposalId, _houseId, _title);
    }

    /// @notice Cast a vote on an active proposal.
    /// @param _proposalId  The proposal to vote on.
    /// @param _support     True for yes, false for no.
    function castVote(uint256 _proposalId, bool _support) external {
        require(
            _proposalId < proposals.length,
            "HouseVoting: invalid proposal"
        );

        Proposal storage p = proposals[_proposalId];

        require(
            registry.getMemberHouse(msg.sender) == p.houseId,
            "HouseVoting: caller not member of proposal house"
        );
        require(
            !hasVoted[_proposalId][msg.sender],
            "HouseVoting: already voted"
        );
        require(
            block.timestamp >= p.startTime && block.timestamp <= p.endTime,
            "HouseVoting: voting not active"
        );

        hasVoted[_proposalId][msg.sender] = true;

        if (_support) {
            p.yesVotes += 1;
        } else {
            p.noVotes += 1;
        }

        emit VoteCast(msg.sender, _proposalId, _support);
    }

    // ---------------------------------------------------------------
    // Proposal views
    // ---------------------------------------------------------------

    /// @notice Returns the result of a proposal.
    function getProposalResult(
        uint256 _proposalId
    ) external view returns (uint256 yesVotes, uint256 noVotes, bool ended) {
        require(
            _proposalId < proposals.length,
            "HouseVoting: invalid proposal"
        );
        Proposal storage p = proposals[_proposalId];
        return (p.yesVotes, p.noVotes, block.timestamp > p.endTime);
    }

    /// @notice Returns the total number of proposals.
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    // ---------------------------------------------------------------
    // Leader election
    // ---------------------------------------------------------------

    /// @notice Vote for a leader in your house.  You may change your vote
    ///         at any time; the old vote is decremented and the new vote
    ///         incremented.
    /// @param _houseId    The house to vote in.
    /// @param _candidate  The address you want to be leader.
    function voteForLeader(uint256 _houseId, address _candidate) external {
        require(
            registry.getMemberHouse(msg.sender) == _houseId && _houseId != 0,
            "HouseVoting: caller not member of this house"
        );

        address previousCandidate = leaderVotes[_houseId][msg.sender];

        // Decrement old vote if the caller previously voted.
        if (previousCandidate != address(0)) {
            leaderVoteCounts[_houseId][previousCandidate] -= 1;
        }

        // Record new vote.
        leaderVotes[_houseId][msg.sender] = _candidate;
        leaderVoteCounts[_houseId][_candidate] += 1;

        emit LeaderVoteChanged(msg.sender, _houseId, _candidate);
    }

    /// @notice Returns the leader vote count for a candidate in a house.
    function getLeaderVoteCount(
        uint256 _houseId,
        address _candidate
    ) external view returns (uint256) {
        return leaderVoteCounts[_houseId][_candidate];
    }
}
