// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PartyRegistry.sol";
import "./Cabinet.sol";
import "./MembershipNFT.sol";
import "./NormsRegistry.sol";

/**
 * @title DisputeResolver
 * @notice Members file disputes citing a norm version + content hash. The
 *         president (or a cabinet member with DisputeResolve power) issues
 *         a binding verdict. Verdicts gate Franchise.slashMember.
 */
contract DisputeResolver {
    enum Verdict {
        Pending,
        Dismissed,
        Slash,
        Eject
    }

    struct Dispute {
        uint256 partyId;
        address complainant;
        address defendant;
        uint256 normVersion;
        bytes32 normHash;
        string evidenceCID;
        Verdict verdict;
        uint256 filedAt;
        uint256 resolvedAt;
        address resolver;
        string resolutionCID;
    }

    PartyRegistry public registry;
    Cabinet public cabinet;
    MembershipNFT public membership;
    NormsRegistry public norms;

    Dispute[] public disputes;

    event DisputeFiled(
        uint256 indexed disputeId,
        uint256 indexed partyId,
        address indexed complainant,
        address defendant
    );
    event DisputeResolved(
        uint256 indexed disputeId,
        address indexed resolver,
        Verdict verdict
    );

    error NotMember();
    error NotResolver();
    error AlreadyResolved();
    error InvalidNormCitation();
    error InvalidVerdict();

    constructor(
        address _registry,
        address _cabinet,
        address _membership,
        address _norms
    ) {
        require(_registry != address(0), "DR: zero registry");
        require(_cabinet != address(0), "DR: zero cabinet");
        require(_membership != address(0), "DR: zero membership");
        require(_norms != address(0), "DR: zero norms");

        registry = PartyRegistry(_registry);
        cabinet = Cabinet(_cabinet);
        membership = MembershipNFT(_membership);
        norms = NormsRegistry(_norms);

        disputes.push();
    }

    function file(
        uint256 _partyId,
        address _defendant,
        uint256 _normVersion,
        bytes32 _normHash,
        string calldata _evidenceCID
    ) external returns (uint256 disputeId) {
        if (!membership.isMember(_partyId, msg.sender)) revert NotMember();
        if (!membership.isMember(_partyId, _defendant)) revert NotMember();
        if (!norms.isNormValid(_partyId, _normVersion, _normHash))
            revert InvalidNormCitation();

        disputes.push(
            Dispute({
                partyId: _partyId,
                complainant: msg.sender,
                defendant: _defendant,
                normVersion: _normVersion,
                normHash: _normHash,
                evidenceCID: _evidenceCID,
                verdict: Verdict.Pending,
                filedAt: block.timestamp,
                resolvedAt: 0,
                resolver: address(0),
                resolutionCID: ""
            })
        );

        disputeId = disputes.length - 1;
        emit DisputeFiled(disputeId, _partyId, msg.sender, _defendant);
    }

    function resolve(
        uint256 _disputeId,
        Verdict _verdict,
        string calldata _resolutionCID
    ) external {
        require(_disputeId > 0 && _disputeId < disputes.length, "DR: bad id");
        Dispute storage d = disputes[_disputeId];
        if (d.verdict != Verdict.Pending) revert AlreadyResolved();
        if (
            !cabinet.hasPower(d.partyId, msg.sender, Cabinet.Power.DisputeResolve)
        ) revert NotResolver();
        if (_verdict == Verdict.Pending) revert InvalidVerdict();

        d.verdict = _verdict;
        d.resolvedAt = block.timestamp;
        d.resolver = msg.sender;
        d.resolutionCID = _resolutionCID;

        emit DisputeResolved(_disputeId, msg.sender, _verdict);
    }

    function isResolved(uint256 _disputeId) external view returns (bool) {
        if (_disputeId == 0 || _disputeId >= disputes.length) return false;
        return disputes[_disputeId].verdict != Verdict.Pending;
    }

    function getDispute(
        uint256 _disputeId
    )
        external
        view
        returns (
            uint256 partyId,
            address defendant,
            uint256 normVersion,
            bytes32 normHash,
            uint8 verdict
        )
    {
        Dispute storage d = disputes[_disputeId];
        return (
            d.partyId,
            d.defendant,
            d.normVersion,
            d.normHash,
            uint8(d.verdict)
        );
    }

    function disputeCount() external view returns (uint256) {
        return disputes.length;
    }
}
