// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PartyRegistry.sol";

/**
 * @title MembershipNFT
 * @notice Soulbound ERC-721 representing party membership. Minted when the
 *         Franchise contract executes a member's grant; burned on revoke.
 *         Cannot be transferred. The "you are really a member" credential.
 */
contract MembershipNFT is ERC721 {
    using Strings for uint256;

    struct Membership {
        uint256 partyId;
        uint256 joinedAt;
        bytes32 franchiseHash;
        uint256 normsVersion;
        bool active;
    }

    PartyRegistry public registry;
    address public franchise;
    address public admin;
    uint256 public nextTokenId = 1;

    mapping(uint256 => Membership) public memberships;
    mapping(uint256 => mapping(address => uint256)) public memberTokenOf;
    mapping(uint256 => uint256) public partyMemberCount;

    event MembershipMinted(
        uint256 indexed tokenId,
        uint256 indexed partyId,
        address indexed member,
        uint256 normsVersion
    );
    event MembershipBurned(
        uint256 indexed tokenId,
        uint256 indexed partyId,
        address indexed member
    );

    error Soulbound();
    error NotFranchise();
    error AlreadyMember();
    error NotMember();

    constructor(
        address _registry
    ) ERC721("Technodemocracy Membership", "TDMEM") {
        require(_registry != address(0), "MembershipNFT: zero registry");
        registry = PartyRegistry(_registry);
        admin = msg.sender;
    }

    function setFranchise(address _franchise) external {
        require(msg.sender == admin, "MembershipNFT: not admin");
        franchise = _franchise;
    }

    function mintMembership(
        address _member,
        uint256 _partyId,
        bytes32 _franchiseHash,
        uint256 _normsVersion
    ) external returns (uint256 tokenId) {
        if (msg.sender != franchise) revert NotFranchise();
        if (memberTokenOf[_partyId][_member] != 0) revert AlreadyMember();
        require(registry.isActive(_partyId), "MembershipNFT: party inactive");

        tokenId = nextTokenId++;
        _safeMint(_member, tokenId);
        memberships[tokenId] = Membership({
            partyId: _partyId,
            joinedAt: block.timestamp,
            franchiseHash: _franchiseHash,
            normsVersion: _normsVersion,
            active: true
        });
        memberTokenOf[_partyId][_member] = tokenId;
        partyMemberCount[_partyId] += 1;

        emit MembershipMinted(tokenId, _partyId, _member, _normsVersion);
    }

    function burnMembership(uint256 _tokenId) external {
        if (msg.sender != franchise) revert NotFranchise();
        Membership storage m = memberships[_tokenId];
        if (!m.active) revert NotMember();

        address owner = ownerOf(_tokenId);
        m.active = false;
        memberTokenOf[m.partyId][owner] = 0;
        partyMemberCount[m.partyId] -= 1;
        _burn(_tokenId);

        emit MembershipBurned(_tokenId, m.partyId, owner);
    }

    // Soulbound: block transfers (allow mint + burn)
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }

    function isMember(
        uint256 _partyId,
        address _member
    ) external view returns (bool) {
        uint256 tid = memberTokenOf[_partyId][_member];
        return tid != 0 && memberships[tid].active;
    }

    function membershipOf(
        uint256 _partyId,
        address _member
    ) external view returns (Membership memory) {
        uint256 tid = memberTokenOf[_partyId][_member];
        require(tid != 0, "MembershipNFT: not member");
        return memberships[tid];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        Membership memory m = memberships[tokenId];
        return
            string(
                abi.encodePacked(
                    "data:application/json,{",
                    '"name":"Membership #',
                    tokenId.toString(),
                    '","description":"Soulbound membership in a Technodemocracy party.",',
                    '"attributes":[',
                    '{"trait_type":"Party","value":"',
                    m.partyId.toString(),
                    '"},',
                    '{"trait_type":"Norms Version","value":"',
                    m.normsVersion.toString(),
                    '"},',
                    '{"trait_type":"Joined At","value":"',
                    m.joinedAt.toString(),
                    '"}',
                    "]}"
                )
            );
    }
}
