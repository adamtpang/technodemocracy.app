// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PartyRegistry.sol";
import "./MembershipNFT.sol";
import "./Franchise.sol";
import "./IVotedNFT.sol";

/**
 * @title Voting
 * @notice Streaming votes for party proposals.
 *         - Sybil resistance via soulbound MembershipNFT
 *         - Direct vote = full weight (10000 bps)
 *         - President can cast delegated weight via Franchise scope
 *         - Mints "I Voted" NFT on every cast
 */
contract Voting {
    struct Proposal {
        uint256 partyId;
        string title;
        string descriptionCID;
        address creator;
        uint256 startTime;
        uint256 endTime;
        uint256 yesWeight;
        uint256 noWeight;
        bool executed;
    }

    PartyRegistry public registry;
    MembershipNFT public membership;
    Franchise public franchise;
    IVotedNFT public ivotedNFT;

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => uint256)) public weightCast;
    mapping(address => bool) public authorizedCallers;

    address public admin;

    event ProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed partyId,
        address indexed creator,
        string title
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        bool support,
        uint256 weight,
        uint256 nftTokenId
    );
    event ProposalExecuted(
        uint256 indexed proposalId,
        bool passed,
        uint256 yesWeight,
        uint256 noWeight
    );

    error NotMember();
    error NotAdmin();
    error AlreadyVoted();
    error VotingClosed();
    error VotingNotEnded();
    error AlreadyExecuted();
    error NotAuthorized();
    error ZeroDuration();

    constructor(
        address _registry,
        address _membership,
        address _franchise
    ) {
        require(_registry != address(0), "Voting: zero registry");
        require(_membership != address(0), "Voting: zero membership");
        require(_franchise != address(0), "Voting: zero franchise");

        registry = PartyRegistry(_registry);
        membership = MembershipNFT(_membership);
        franchise = Franchise(_franchise);
        admin = msg.sender;

        proposals.push();
    }

    function setIVotedNFT(address _nft) external {
        if (msg.sender != admin) revert NotAdmin();
        ivotedNFT = IVotedNFT(_nft);
    }

    function setAuthorizedCaller(address _c, bool _ok) external {
        if (msg.sender != admin) revert NotAdmin();
        authorizedCallers[_c] = _ok;
    }

    function createProposal(
        uint256 _partyId,
        string calldata _title,
        string calldata _descriptionCID,
        uint256 _duration
    ) external returns (uint256 proposalId) {
        if (!membership.isMember(_partyId, msg.sender)) revert NotMember();
        return _createProposal(_partyId, _title, _descriptionCID, _duration, msg.sender);
    }

    function createProposalOnBehalf(
        uint256 _partyId,
        string calldata _title,
        string calldata _descriptionCID,
        uint256 _duration,
        address _onBehalfOf
    ) external returns (uint256 proposalId) {
        if (!authorizedCallers[msg.sender]) revert NotAuthorized();
        if (!membership.isMember(_partyId, _onBehalfOf)) revert NotMember();
        return _createProposal(_partyId, _title, _descriptionCID, _duration, _onBehalfOf);
    }

    function _createProposal(
        uint256 _partyId,
        string calldata _title,
        string calldata _descriptionCID,
        uint256 _duration,
        address _creator
    ) internal returns (uint256 proposalId) {
        if (_duration == 0) revert ZeroDuration();

        proposals.push(
            Proposal({
                partyId: _partyId,
                title: _title,
                descriptionCID: _descriptionCID,
                creator: _creator,
                startTime: block.timestamp,
                endTime: block.timestamp + _duration,
                yesWeight: 0,
                noWeight: 0,
                executed: false
            })
        );

        proposalId = proposals.length - 1;
        emit ProposalCreated(proposalId, _partyId, _creator, _title);
    }

    function castVote(uint256 _proposalId, bool _support) external {
        require(_proposalId > 0 && _proposalId < proposals.length, "Voting: bad id");
        Proposal storage p = proposals[_proposalId];
        if (!membership.isMember(p.partyId, msg.sender)) revert NotMember();
        if (weightCast[_proposalId][msg.sender] != 0) revert AlreadyVoted();
        if (block.timestamp < p.startTime || block.timestamp > p.endTime)
            revert VotingClosed();

        uint256 weight = 10000;
        weightCast[_proposalId][msg.sender] = weight;

        if (_support) p.yesWeight += weight;
        else p.noWeight += weight;

        uint256 tokenId = 0;
        if (address(ivotedNFT) != address(0)) {
            tokenId = ivotedNFT.mintReceipt(
                msg.sender,
                p.partyId,
                _proposalId,
                _support
            );
        }

        emit VoteCast(msg.sender, _proposalId, _support, weight, tokenId);
    }

    function castDelegatedVotes(
        uint256 _proposalId,
        bool _support,
        address[] calldata _delegators
    ) external {
        require(_proposalId > 0 && _proposalId < proposals.length, "Voting: bad id");
        Proposal storage p = proposals[_proposalId];
        require(
            registry.partyPresident(p.partyId) == msg.sender,
            "Voting: not president"
        );
        if (block.timestamp < p.startTime || block.timestamp > p.endTime)
            revert VotingClosed();

        for (uint256 i = 0; i < _delegators.length; i++) {
            address d = _delegators[i];
            if (weightCast[_proposalId][d] != 0) continue;
            uint16 bps = franchise.getDelegatedVoteBps(p.partyId, d);
            if (bps == 0) continue;
            if (!membership.isMember(p.partyId, d)) continue;

            weightCast[_proposalId][d] = bps;
            if (_support) p.yesWeight += bps;
            else p.noWeight += bps;

            uint256 tokenId = 0;
            if (address(ivotedNFT) != address(0)) {
                tokenId = ivotedNFT.mintReceipt(d, p.partyId, _proposalId, _support);
            }
            emit VoteCast(d, _proposalId, _support, bps, tokenId);
        }
    }

    function executeProposal(uint256 _proposalId) external {
        require(_proposalId > 0 && _proposalId < proposals.length, "Voting: bad id");
        Proposal storage p = proposals[_proposalId];
        if (p.executed) revert AlreadyExecuted();
        if (block.timestamp <= p.endTime) revert VotingNotEnded();

        p.executed = true;
        bool passed = p.yesWeight > p.noWeight;
        emit ProposalExecuted(_proposalId, passed, p.yesWeight, p.noWeight);
    }

    function proposalCount() external view returns (uint256) {
        return proposals.length;
    }

    function getResult(
        uint256 _proposalId
    )
        external
        view
        returns (uint256 yesWeight, uint256 noWeight, bool ended, bool passed)
    {
        Proposal storage p = proposals[_proposalId];
        ended = block.timestamp > p.endTime;
        passed = p.yesWeight > p.noWeight;
        return (p.yesWeight, p.noWeight, ended, passed);
    }
}
