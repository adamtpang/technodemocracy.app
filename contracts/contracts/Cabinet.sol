// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PartyRegistry.sol";

/**
 * @title Cabinet
 * @notice Digital delegation. The president names cabinet members and grants
 *         each cryptographically scoped powers — never more than the typed
 *         Power enum allows.
 */
contract Cabinet {
    enum Power {
        TreasurySmallSpend,
        TreasuryLargeSpend,
        NormsAmendment,
        EventScheduler,
        DisputeResolve,
        MemberOnboard,
        ElectionScheduler,
        CensusAdmin
    }

    struct Seat {
        address holder;
        string role;
        uint256 powersMask;
        uint256 appointedAt;
        bool active;
    }

    PartyRegistry public registry;
    mapping(uint256 => Seat[]) public partyCabinet;
    mapping(uint256 => mapping(address => uint256)) public holderSeat;

    event CabinetAppointed(
        uint256 indexed partyId,
        address indexed holder,
        string role,
        uint256 powersMask
    );
    event CabinetRemoved(uint256 indexed partyId, address indexed holder);
    event PowersUpdated(
        uint256 indexed partyId,
        address indexed holder,
        uint256 newPowersMask
    );

    error NotPresident();
    error AlreadyOnCabinet();
    error NotOnCabinet();

    constructor(address _registry) {
        require(_registry != address(0), "Cabinet: zero registry");
        registry = PartyRegistry(_registry);
    }

    function appoint(
        uint256 _partyId,
        address _holder,
        string calldata _role,
        uint256 _powersMask
    ) external returns (uint256 seatIdx) {
        if (registry.partyPresident(_partyId) != msg.sender) revert NotPresident();
        if (holderSeat[_partyId][_holder] != 0) revert AlreadyOnCabinet();

        partyCabinet[_partyId].push(
            Seat({
                holder: _holder,
                role: _role,
                powersMask: _powersMask,
                appointedAt: block.timestamp,
                active: true
            })
        );
        seatIdx = partyCabinet[_partyId].length - 1;
        holderSeat[_partyId][_holder] = seatIdx + 1;

        emit CabinetAppointed(_partyId, _holder, _role, _powersMask);
    }

    function remove(uint256 _partyId, address _holder) external {
        if (registry.partyPresident(_partyId) != msg.sender) revert NotPresident();
        uint256 seatIdxPlus1 = holderSeat[_partyId][_holder];
        if (seatIdxPlus1 == 0) revert NotOnCabinet();

        partyCabinet[_partyId][seatIdxPlus1 - 1].active = false;
        partyCabinet[_partyId][seatIdxPlus1 - 1].powersMask = 0;
        holderSeat[_partyId][_holder] = 0;

        emit CabinetRemoved(_partyId, _holder);
    }

    function updatePowers(
        uint256 _partyId,
        address _holder,
        uint256 _newPowersMask
    ) external {
        if (registry.partyPresident(_partyId) != msg.sender) revert NotPresident();
        uint256 seatIdxPlus1 = holderSeat[_partyId][_holder];
        if (seatIdxPlus1 == 0) revert NotOnCabinet();

        partyCabinet[_partyId][seatIdxPlus1 - 1].powersMask = _newPowersMask;
        emit PowersUpdated(_partyId, _holder, _newPowersMask);
    }

    function hasPower(
        uint256 _partyId,
        address _holder,
        Power _power
    ) external view returns (bool) {
        if (registry.partyPresident(_partyId) == _holder) return true;
        uint256 seatIdxPlus1 = holderSeat[_partyId][_holder];
        if (seatIdxPlus1 == 0) return false;
        Seat storage s = partyCabinet[_partyId][seatIdxPlus1 - 1];
        if (!s.active) return false;
        return (s.powersMask & (1 << uint256(_power))) != 0;
    }

    function cabinetSize(uint256 _partyId) external view returns (uint256) {
        return partyCabinet[_partyId].length;
    }
}
