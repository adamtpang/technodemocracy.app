// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./HouseRegistry.sol";
import "./HouseVoting.sol";

contract HouseTreasury {
    // ---------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------

    struct SpendProposal {
        uint256 houseId;
        address recipient;
        uint256 amount;
        string reason;
        uint256 proposalId; // corresponding proposal in HouseVoting
        bool executed;
    }

    // ---------------------------------------------------------------
    // State
    // ---------------------------------------------------------------

    HouseRegistry public registry;
    HouseVoting public voting;
    IERC20 public usdc;

    SpendProposal[] public spendProposals;

    /// @notice houseId => USDC balance held for that house.
    mapping(uint256 => uint256) public houseTreasuryBalance;

    // ---------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------

    event TreasuryDeposit(uint256 indexed houseId, uint256 amount);

    event SpendProposalCreated(
        uint256 indexed spendProposalId,
        uint256 indexed houseId
    );

    event SpendExecuted(
        uint256 indexed spendProposalId,
        address recipient,
        uint256 amount
    );

    // ---------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------

    /// @param _registry  Address of the HouseRegistry contract.
    /// @param _voting    Address of the HouseVoting contract.
    /// @param _usdc      Address of the USDC token contract.
    constructor(address _registry, address _voting, address _usdc) {
        require(
            _registry != address(0),
            "HouseTreasury: zero registry address"
        );
        require(_voting != address(0), "HouseTreasury: zero voting address");
        require(_usdc != address(0), "HouseTreasury: zero USDC address");

        registry = HouseRegistry(_registry);
        voting = HouseVoting(_voting);
        usdc = IERC20(_usdc);
    }

    // ---------------------------------------------------------------
    // Deposit
    // ---------------------------------------------------------------

    /// @notice Deposit USDC into a house treasury.  Anyone can deposit.
    /// @param _houseId  The house to deposit into (must be valid).
    /// @param _amount   Amount of USDC (in smallest unit) to deposit.
    function deposit(uint256 _houseId, uint256 _amount) external {
        require(
            _houseId > 0 && _houseId < registry.getHouseCount(),
            "HouseTreasury: invalid house ID"
        );
        require(_amount > 0, "HouseTreasury: amount must be > 0");

        bool success = usdc.transferFrom(msg.sender, address(this), _amount);
        require(success, "HouseTreasury: USDC transfer failed");

        houseTreasuryBalance[_houseId] += _amount;

        emit TreasuryDeposit(_houseId, _amount);
    }

    // ---------------------------------------------------------------
    // Spend proposals
    // ---------------------------------------------------------------

    /// @notice Create a spend proposal.  This also creates a governance
    ///         proposal in HouseVoting so house members can vote on it.
    /// @param _houseId    The house whose treasury will be spent.
    /// @param _recipient  Address that will receive the USDC if approved.
    /// @param _amount     Amount of USDC to spend.
    /// @param _reason     Human-readable justification.
    function createSpendProposal(
        uint256 _houseId,
        address _recipient,
        uint256 _amount,
        string calldata _reason
    ) external {
        require(
            registry.getMemberHouse(msg.sender) == _houseId && _houseId != 0,
            "HouseTreasury: caller not member of this house"
        );
        require(
            _recipient != address(0),
            "HouseTreasury: zero recipient"
        );
        require(_amount > 0, "HouseTreasury: amount must be > 0");

        // Create the governance proposal in HouseVoting (7-day vote).
        // Uses createProposalOnBehalf so the proposal is attributed to the
        // calling member, not to this contract address.
        uint256 proposalId = voting.createProposalOnBehalf(
            _houseId,
            string.concat("Treasury Spend: ", _reason),
            keccak256(abi.encodePacked(_reason)),
            7 days,
            msg.sender
        );

        spendProposals.push(
            SpendProposal({
                houseId: _houseId,
                recipient: _recipient,
                amount: _amount,
                reason: _reason,
                proposalId: proposalId,
                executed: false
            })
        );

        uint256 spendProposalId = spendProposals.length - 1;
        emit SpendProposalCreated(spendProposalId, _houseId);
    }

    /// @notice Execute a spend proposal after its vote has passed.
    /// @param _spendProposalId  Index into the spendProposals array.
    function executeSpendProposal(uint256 _spendProposalId) external {
        require(
            _spendProposalId < spendProposals.length,
            "HouseTreasury: invalid spend proposal"
        );

        SpendProposal storage sp = spendProposals[_spendProposalId];
        require(!sp.executed, "HouseTreasury: already executed");

        // Check that the corresponding governance vote has ended and passed.
        (uint256 yesVotes, uint256 noVotes, bool ended) = voting
            .getProposalResult(sp.proposalId);
        require(ended, "HouseTreasury: vote not ended");
        require(yesVotes > noVotes, "HouseTreasury: vote did not pass");

        // Ensure the house treasury has enough funds.
        require(
            houseTreasuryBalance[sp.houseId] >= sp.amount,
            "HouseTreasury: insufficient funds"
        );

        sp.executed = true;
        houseTreasuryBalance[sp.houseId] -= sp.amount;

        bool success = usdc.transfer(sp.recipient, sp.amount);
        require(success, "HouseTreasury: USDC transfer failed");

        emit SpendExecuted(_spendProposalId, sp.recipient, sp.amount);
    }

    // ---------------------------------------------------------------
    // View helpers
    // ---------------------------------------------------------------

    /// @notice Returns the USDC balance held in a house's treasury.
    function getHouseTreasury(
        uint256 _houseId
    ) external view returns (uint256) {
        return houseTreasuryBalance[_houseId];
    }
}
