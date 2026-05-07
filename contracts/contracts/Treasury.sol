// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PartyRegistry.sol";
import "./MembershipNFT.sol";
import "./Cabinet.sol";
import "./Voting.sol";

/**
 * @title Treasury
 * @notice 3 spend lanes:
 *         1. Small spend: cabinet treasurer ≤ smallSpendCap, no vote
 *         2. Large spend: member-vote required (7-day window)
 *         3. Emergency: 2-of-N cabinet co-sign ≤ emergencyCap
 */
contract Treasury {
    struct SpendProposal {
        uint256 partyId;
        address recipient;
        uint256 amount;
        string reason;
        uint256 votingProposalId;
        bool executed;
    }

    PartyRegistry public registry;
    MembershipNFT public membership;
    Cabinet public cabinet;
    Voting public voting;
    IERC20 public usdc;

    mapping(uint256 => uint256) public balanceOf;
    mapping(uint256 => uint256) public smallSpendCap;
    mapping(uint256 => uint256) public emergencyCap;

    SpendProposal[] public spendProposals;

    mapping(uint256 => mapping(address => bool)) public emergencySigned;
    mapping(uint256 => uint256) public emergencySigCount;

    event Deposit(uint256 indexed partyId, uint256 amount, address from);
    event SmallSpendExecuted(
        uint256 indexed partyId,
        address indexed by,
        address recipient,
        uint256 amount,
        string reason
    );
    event SpendProposed(
        uint256 indexed proposalId,
        uint256 indexed partyId,
        uint256 amount,
        address recipient
    );
    event SpendExecuted(
        uint256 indexed proposalId,
        address recipient,
        uint256 amount
    );
    event EmergencySigned(
        uint256 indexed proposalId,
        address indexed signer,
        uint256 sigCount
    );
    event SmallSpendCapUpdated(uint256 indexed partyId, uint256 cap);
    event EmergencyCapUpdated(uint256 indexed partyId, uint256 cap);

    error NotMember();
    error NotPresident();
    error NotAuthorized();
    error InsufficientBalance();
    error AlreadyExecuted();
    error VoteNotPassed();
    error VoteNotEnded();
    error AmountExceedsCap();
    error AmountAboveSmallSpend();
    error NotEmergencyEligible();

    constructor(
        address _registry,
        address _membership,
        address _cabinet,
        address _voting,
        address _usdc
    ) {
        require(_registry != address(0), "Treasury: zero registry");
        require(_membership != address(0), "Treasury: zero membership");
        require(_cabinet != address(0), "Treasury: zero cabinet");
        require(_voting != address(0), "Treasury: zero voting");
        require(_usdc != address(0), "Treasury: zero usdc");

        registry = PartyRegistry(_registry);
        membership = MembershipNFT(_membership);
        cabinet = Cabinet(_cabinet);
        voting = Voting(_voting);
        usdc = IERC20(_usdc);

        spendProposals.push();
    }

    function setSmallSpendCap(uint256 _partyId, uint256 _cap) external {
        if (registry.partyPresident(_partyId) != msg.sender) revert NotPresident();
        smallSpendCap[_partyId] = _cap;
        emit SmallSpendCapUpdated(_partyId, _cap);
    }

    function setEmergencyCap(uint256 _partyId, uint256 _cap) external {
        if (registry.partyPresident(_partyId) != msg.sender) revert NotPresident();
        emergencyCap[_partyId] = _cap;
        emit EmergencyCapUpdated(_partyId, _cap);
    }

    function deposit(uint256 _partyId, uint256 _amount) external {
        require(registry.isActive(_partyId), "Treasury: party inactive");
        require(_amount > 0, "Treasury: zero");
        require(
            usdc.transferFrom(msg.sender, address(this), _amount),
            "Treasury: transfer failed"
        );
        balanceOf[_partyId] += _amount;
        emit Deposit(_partyId, _amount, msg.sender);
    }

    function smallSpend(
        uint256 _partyId,
        address _recipient,
        uint256 _amount,
        string calldata _reason
    ) external {
        if (
            !cabinet.hasPower(_partyId, msg.sender, Cabinet.Power.TreasurySmallSpend)
        ) revert NotAuthorized();
        if (_amount > smallSpendCap[_partyId]) revert AmountAboveSmallSpend();
        if (balanceOf[_partyId] < _amount) revert InsufficientBalance();

        balanceOf[_partyId] -= _amount;
        require(usdc.transfer(_recipient, _amount), "Treasury: send failed");

        emit SmallSpendExecuted(_partyId, msg.sender, _recipient, _amount, _reason);
    }

    function proposeLargeSpend(
        uint256 _partyId,
        address _recipient,
        uint256 _amount,
        string calldata _reason,
        string calldata _descriptionCID
    ) external returns (uint256 proposalId) {
        if (!membership.isMember(_partyId, msg.sender)) revert NotMember();
        require(_recipient != address(0), "Treasury: zero recipient");
        require(_amount > 0, "Treasury: zero amount");

        uint256 votingId = voting.createProposalOnBehalf(
            _partyId,
            string.concat("Treasury Spend: ", _reason),
            _descriptionCID,
            7 days,
            msg.sender
        );

        spendProposals.push(
            SpendProposal({
                partyId: _partyId,
                recipient: _recipient,
                amount: _amount,
                reason: _reason,
                votingProposalId: votingId,
                executed: false
            })
        );

        proposalId = spendProposals.length - 1;
        emit SpendProposed(proposalId, _partyId, _amount, _recipient);
    }

    function executeLargeSpend(uint256 _proposalId) external {
        require(_proposalId > 0 && _proposalId < spendProposals.length, "Treasury: bad id");
        SpendProposal storage sp = spendProposals[_proposalId];
        if (sp.executed) revert AlreadyExecuted();

        (
            uint256 yes,
            uint256 no,
            bool ended,
            bool passed
        ) = voting.getResult(sp.votingProposalId);
        if (!ended) revert VoteNotEnded();
        if (!passed || yes <= no) revert VoteNotPassed();

        if (balanceOf[sp.partyId] < sp.amount) revert InsufficientBalance();
        sp.executed = true;
        balanceOf[sp.partyId] -= sp.amount;

        require(usdc.transfer(sp.recipient, sp.amount), "Treasury: send failed");
        emit SpendExecuted(_proposalId, sp.recipient, sp.amount);
    }

    function emergencySign(uint256 _proposalId) external {
        require(_proposalId > 0 && _proposalId < spendProposals.length, "Treasury: bad id");
        SpendProposal storage sp = spendProposals[_proposalId];
        if (sp.executed) revert AlreadyExecuted();
        if (sp.amount > emergencyCap[sp.partyId]) revert AmountExceedsCap();
        if (
            !cabinet.hasPower(sp.partyId, msg.sender, Cabinet.Power.TreasuryLargeSpend)
        ) revert NotEmergencyEligible();
        if (emergencySigned[_proposalId][msg.sender]) return;

        emergencySigned[_proposalId][msg.sender] = true;
        emergencySigCount[_proposalId] += 1;

        emit EmergencySigned(_proposalId, msg.sender, emergencySigCount[_proposalId]);

        if (emergencySigCount[_proposalId] >= 2) {
            if (balanceOf[sp.partyId] < sp.amount) revert InsufficientBalance();
            sp.executed = true;
            balanceOf[sp.partyId] -= sp.amount;
            require(
                usdc.transfer(sp.recipient, sp.amount),
                "Treasury: send failed"
            );
            emit SpendExecuted(_proposalId, sp.recipient, sp.amount);
        }
    }

    function spendProposalCount() external view returns (uint256) {
        return spendProposals.length;
    }
}
