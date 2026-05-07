// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PartyRegistry.sol";
import "./MembershipNFT.sol";
import "./NormsRegistry.sol";

interface IDisputeResolver {
    function isResolved(uint256 _disputeId) external view returns (bool);
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
        );
}

/**
 * @title Franchise
 * @notice The binding social smart contract a member grants to the party
 *         president on join. Like Google OAuth, but for political parties.
 *         Permissions are TYPED (Scope enum) for unambiguous on-chain
 *         enforcement and OAuth-style consent screens.
 */
contract Franchise {
    enum Scope {
        VotePresident,
        AnnualDues,
        Slashing,
        DelegatedVote,
        FollowAccount,
        NormCommit,
        DisputeResolverAssign,
        AttendanceCommit
    }

    struct PartyFranchise {
        uint256 duesUSDC;
        uint256 slashingMaxUSDC;
        uint16 delegatedVoteBps;
        uint256 normsVersionAtRegistration;
        uint256 requiredScopesMask;
        uint256 optionalScopesMask;
        bool registered;
        address registeredBy;
    }

    struct MemberGrant {
        bool active;
        uint256 grantedAt;
        uint256 nextDuesAt;
        uint256 totalSlashed;
        uint256 normsVersionAgreed;
        uint256 grantedScopesMask;
    }

    PartyRegistry public registry;
    MembershipNFT public membership;
    NormsRegistry public norms;
    IERC20 public usdc;
    IDisputeResolver public disputeResolver;

    mapping(uint256 => PartyFranchise) public partyFranchise;
    mapping(uint256 => mapping(address => MemberGrant)) public memberGrants;

    address public admin;

    event FranchiseRegistered(
        uint256 indexed partyId,
        address indexed president,
        uint256 duesUSDC,
        uint256 slashingMaxUSDC,
        uint16 delegatedVoteBps
    );
    event FranchiseGranted(
        uint256 indexed partyId,
        address indexed member,
        uint256 grantedScopesMask,
        uint256 firstDuesPaid,
        uint256 indexed membershipTokenId
    );
    event FranchiseRevoked(uint256 indexed partyId, address indexed member);
    event ScopeRevoked(
        uint256 indexed partyId,
        address indexed member,
        Scope scope
    );
    event DuesDebited(
        uint256 indexed partyId,
        address indexed member,
        uint256 amount
    );
    event MemberSlashed(
        uint256 indexed partyId,
        address indexed member,
        uint256 amount,
        uint256 disputeId,
        uint256 normVersion
    );

    error NotPresident();
    error NotAdmin();
    error NotRegistered();
    error AlreadyGranted();
    error MissingRequiredScope();
    error ScopeNotGranted();
    error TooMuchVoteWeight();
    error DuesNotDue();
    error SlashCapExceeded();
    error UnresolvedDispute();
    error DisputeWrongParty();
    error DisputeWrongDefendant();
    error InvalidNormCitation();

    constructor(
        address _registry,
        address _membership,
        address _norms,
        address _usdc
    ) {
        require(_registry != address(0), "Franchise: zero registry");
        require(_membership != address(0), "Franchise: zero membership");
        require(_norms != address(0), "Franchise: zero norms");
        require(_usdc != address(0), "Franchise: zero usdc");

        registry = PartyRegistry(_registry);
        membership = MembershipNFT(_membership);
        norms = NormsRegistry(_norms);
        usdc = IERC20(_usdc);
        admin = msg.sender;
    }

    function setDisputeResolver(address _resolver) external {
        if (msg.sender != admin) revert NotAdmin();
        disputeResolver = IDisputeResolver(_resolver);
    }

    function setAdmin(address _admin) external {
        if (msg.sender != admin) revert NotAdmin();
        admin = _admin;
    }

    function registerFranchise(
        uint256 _partyId,
        uint256 _duesUSDC,
        uint256 _slashingMaxUSDC,
        uint16 _delegatedVoteBps,
        uint256 _requiredScopesMask,
        uint256 _optionalScopesMask
    ) external {
        if (registry.partyPresident(_partyId) != msg.sender) revert NotPresident();
        if (_delegatedVoteBps > 10000) revert TooMuchVoteWeight();

        partyFranchise[_partyId] = PartyFranchise({
            duesUSDC: _duesUSDC,
            slashingMaxUSDC: _slashingMaxUSDC,
            delegatedVoteBps: _delegatedVoteBps,
            normsVersionAtRegistration: norms.currentVersion(_partyId),
            requiredScopesMask: _requiredScopesMask,
            optionalScopesMask: _optionalScopesMask,
            registered: true,
            registeredBy: msg.sender
        });

        emit FranchiseRegistered(
            _partyId,
            msg.sender,
            _duesUSDC,
            _slashingMaxUSDC,
            _delegatedVoteBps
        );
    }

    function grantFranchise(
        uint256 _partyId,
        uint256 _grantedScopesMask
    ) external {
        PartyFranchise storage pf = partyFranchise[_partyId];
        if (!pf.registered) revert NotRegistered();
        if (memberGrants[_partyId][msg.sender].active) revert AlreadyGranted();
        if ((pf.requiredScopesMask & _grantedScopesMask) != pf.requiredScopesMask) {
            revert MissingRequiredScope();
        }

        if (
            pf.duesUSDC > 0 && _isScopeInMask(_grantedScopesMask, Scope.AnnualDues)
        ) {
            require(
                usdc.transferFrom(msg.sender, address(this), pf.duesUSDC),
                "Franchise: dues failed"
            );
        }

        uint256 currentNormsV = norms.currentVersion(_partyId);
        bytes32 fhash = keccak256(
            abi.encode(
                _partyId,
                pf.duesUSDC,
                pf.slashingMaxUSDC,
                pf.delegatedVoteBps,
                _grantedScopesMask
            )
        );
        uint256 tokenId = membership.mintMembership(
            msg.sender,
            _partyId,
            fhash,
            currentNormsV
        );

        memberGrants[_partyId][msg.sender] = MemberGrant({
            active: true,
            grantedAt: block.timestamp,
            nextDuesAt: block.timestamp + 365 days,
            totalSlashed: 0,
            normsVersionAgreed: currentNormsV,
            grantedScopesMask: _grantedScopesMask
        });

        emit FranchiseGranted(
            _partyId,
            msg.sender,
            _grantedScopesMask,
            pf.duesUSDC,
            tokenId
        );
    }

    function revokeFranchise(uint256 _partyId) external {
        MemberGrant storage mg = memberGrants[_partyId][msg.sender];
        if (!mg.active) revert ScopeNotGranted();
        mg.active = false;
        mg.grantedScopesMask = 0;

        uint256 tokenId = membership.memberTokenOf(_partyId, msg.sender);
        if (tokenId != 0) membership.burnMembership(tokenId);

        emit FranchiseRevoked(_partyId, msg.sender);
    }

    function revokeScope(uint256 _partyId, Scope _scope) external {
        MemberGrant storage mg = memberGrants[_partyId][msg.sender];
        if (!mg.active) revert ScopeNotGranted();
        if (!_isScopeInMask(mg.grantedScopesMask, _scope)) revert ScopeNotGranted();

        PartyFranchise storage pf = partyFranchise[_partyId];
        if (_isScopeInMask(pf.requiredScopesMask, _scope)) {
            mg.active = false;
            mg.grantedScopesMask = 0;
            uint256 tokenId = membership.memberTokenOf(_partyId, msg.sender);
            if (tokenId != 0) membership.burnMembership(tokenId);
            emit FranchiseRevoked(_partyId, msg.sender);
            return;
        }

        mg.grantedScopesMask &= ~_scopeBit(_scope);
        emit ScopeRevoked(_partyId, msg.sender, _scope);
    }

    function debitDues(uint256 _partyId, address _member) external {
        if (registry.partyPresident(_partyId) != msg.sender) revert NotPresident();

        PartyFranchise storage pf = partyFranchise[_partyId];
        MemberGrant storage mg = memberGrants[_partyId][_member];

        if (!mg.active) revert ScopeNotGranted();
        if (!_isScopeInMask(mg.grantedScopesMask, Scope.AnnualDues))
            revert ScopeNotGranted();
        if (block.timestamp < mg.nextDuesAt) revert DuesNotDue();

        if (pf.duesUSDC > 0) {
            require(
                usdc.transferFrom(_member, address(this), pf.duesUSDC),
                "Franchise: dues failed"
            );
        }

        mg.nextDuesAt = block.timestamp + 365 days;
        emit DuesDebited(_partyId, _member, pf.duesUSDC);
    }

    function slashMember(
        uint256 _partyId,
        address _member,
        uint256 _amount,
        uint256 _disputeId,
        uint256 _normVersion,
        bytes32 _normHash
    ) external {
        if (registry.partyPresident(_partyId) != msg.sender) revert NotPresident();

        PartyFranchise storage pf = partyFranchise[_partyId];
        MemberGrant storage mg = memberGrants[_partyId][_member];

        if (!mg.active) revert ScopeNotGranted();
        if (!_isScopeInMask(mg.grantedScopesMask, Scope.Slashing))
            revert ScopeNotGranted();
        if (mg.totalSlashed + _amount > pf.slashingMaxUSDC)
            revert SlashCapExceeded();

        if (!norms.isNormValid(_partyId, _normVersion, _normHash))
            revert InvalidNormCitation();

        require(address(disputeResolver) != address(0), "Franchise: no resolver");
        if (!disputeResolver.isResolved(_disputeId)) revert UnresolvedDispute();
        (
            uint256 dPartyId,
            address dDefendant,
            ,
            ,
            uint8 verdict
        ) = disputeResolver.getDispute(_disputeId);
        if (dPartyId != _partyId) revert DisputeWrongParty();
        if (dDefendant != _member) revert DisputeWrongDefendant();
        require(verdict == 2, "Franchise: verdict not slash");

        mg.totalSlashed += _amount;

        require(
            usdc.transferFrom(_member, address(this), _amount),
            "Franchise: slash failed"
        );

        emit MemberSlashed(
            _partyId,
            _member,
            _amount,
            _disputeId,
            _normVersion
        );
    }

    function isFranchiseGranted(
        uint256 _partyId,
        address _member
    ) external view returns (bool) {
        return memberGrants[_partyId][_member].active;
    }

    function getDelegatedVoteBps(
        uint256 _partyId,
        address _member
    ) external view returns (uint16) {
        MemberGrant storage mg = memberGrants[_partyId][_member];
        if (!mg.active) return 0;
        if (!_isScopeInMask(mg.grantedScopesMask, Scope.DelegatedVote))
            return 0;
        return partyFranchise[_partyId].delegatedVoteBps;
    }

    function hasScope(
        uint256 _partyId,
        address _member,
        Scope _scope
    ) external view returns (bool) {
        MemberGrant storage mg = memberGrants[_partyId][_member];
        return mg.active && _isScopeInMask(mg.grantedScopesMask, _scope);
    }

    function _scopeBit(Scope _s) internal pure returns (uint256) {
        return 1 << uint256(_s);
    }

    function _isScopeInMask(
        uint256 _mask,
        Scope _s
    ) internal pure returns (bool) {
        return (_mask & _scopeBit(_s)) != 0;
    }
}
