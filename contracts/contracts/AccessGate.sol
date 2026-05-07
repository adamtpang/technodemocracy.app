// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PartyRegistry.sol";
import "./MembershipNFT.sol";
import "./Cabinet.sol";
import "./Census.sol";

/**
 * @title AccessGate
 * @notice Bidirectional / real-world access. External systems (Chainlink
 *         Functions, hardware controllers, ticket apps) call canAccess() to
 *         decide whether to unlock doors / drones / etc.
 */
contract AccessGate {
    struct Gate {
        address owner;
        string name;
        uint256 partyId;
        bool requireMembership;
        bool requireCabinet;
        Cabinet.Power requiredPower;
        uint256 minCensusStampCount;
        bool active;
        uint256 createdAt;
    }

    PartyRegistry public registry;
    MembershipNFT public membership;
    Cabinet public cabinet;
    Census public census;

    Gate[] public gates;

    event GateCreated(
        uint256 indexed gateId,
        address indexed owner,
        string name,
        uint256 partyId
    );
    event GateUpdated(uint256 indexed gateId);
    event GateDeactivated(uint256 indexed gateId);
    event AccessChecked(
        uint256 indexed gateId,
        address indexed who,
        bool granted
    );

    error NotOwner();
    error InvalidGate();

    constructor(
        address _registry,
        address _membership,
        address _cabinet,
        address _census
    ) {
        require(_registry != address(0), "AccessGate: zero registry");
        require(_membership != address(0), "AccessGate: zero membership");
        require(_cabinet != address(0), "AccessGate: zero cabinet");
        require(_census != address(0), "AccessGate: zero census");

        registry = PartyRegistry(_registry);
        membership = MembershipNFT(_membership);
        cabinet = Cabinet(_cabinet);
        census = Census(_census);

        gates.push();
    }

    function createGate(
        string calldata _name,
        uint256 _partyId,
        bool _requireMembership,
        bool _requireCabinet,
        Cabinet.Power _requiredPower,
        uint256 _minCensusStampCount
    ) external returns (uint256 gateId) {
        gates.push(
            Gate({
                owner: msg.sender,
                name: _name,
                partyId: _partyId,
                requireMembership: _requireMembership,
                requireCabinet: _requireCabinet,
                requiredPower: _requiredPower,
                minCensusStampCount: _minCensusStampCount,
                active: true,
                createdAt: block.timestamp
            })
        );
        gateId = gates.length - 1;
        emit GateCreated(gateId, msg.sender, _name, _partyId);
    }

    function deactivateGate(uint256 _gateId) external {
        if (_gateId == 0 || _gateId >= gates.length) revert InvalidGate();
        if (gates[_gateId].owner != msg.sender) revert NotOwner();
        gates[_gateId].active = false;
        emit GateDeactivated(_gateId);
    }

    function canAccess(
        uint256 _gateId,
        address _who
    ) public view returns (bool) {
        if (_gateId == 0 || _gateId >= gates.length) return false;
        Gate storage g = gates[_gateId];
        if (!g.active) return false;

        if (g.requireMembership && g.partyId != 0) {
            if (!membership.isMember(g.partyId, _who)) return false;
        }

        if (g.requireCabinet && g.partyId != 0) {
            if (!cabinet.hasPower(g.partyId, _who, g.requiredPower))
                return false;
        }

        if (g.minCensusStampCount > 0) {
            if (census.getStampsOf(_who).length < g.minCensusStampCount)
                return false;
        }

        return true;
    }

    function checkAndLog(
        uint256 _gateId,
        address _who
    ) external returns (bool granted) {
        granted = canAccess(_gateId, _who);
        emit AccessChecked(_gateId, _who, granted);
    }

    function gateCount() external view returns (uint256) {
        return gates.length;
    }
}
