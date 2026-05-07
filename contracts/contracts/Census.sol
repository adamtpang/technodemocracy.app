// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PartyRegistry.sol";
import "./MembershipNFT.sol";
import "./Cabinet.sol";

/**
 * @title Census
 * @notice Periodic proof-of-attendance / proof-of-residence attestations.
 *         Cabinet CensusAdmin creates events; members attest with hash and
 *         receive a soulbound census stamp NFT.
 */
contract Census is ERC721 {
    using Strings for uint256;

    struct CensusEvent {
        uint256 partyId;
        string name;
        string stampCID;
        uint256 startTime;
        uint256 endTime;
        uint256 attestationCount;
    }

    struct Stamp {
        uint256 censusId;
        uint256 partyId;
        bytes32 attestationHash;
        uint256 attestedAt;
    }

    PartyRegistry public registry;
    MembershipNFT public membership;
    Cabinet public cabinet;

    CensusEvent[] public censusEvents;
    mapping(uint256 => Stamp) public stamps;
    mapping(uint256 => mapping(address => bool)) public hasAttested;
    mapping(address => uint256[]) public stampsOf;

    uint256 public nextTokenId = 1;

    event CensusCreated(
        uint256 indexed censusId,
        uint256 indexed partyId,
        string name,
        uint256 startTime,
        uint256 endTime
    );
    event Attested(
        uint256 indexed censusId,
        address indexed member,
        uint256 tokenId
    );

    error Soulbound();
    error NotAuthorized();
    error NotMember();
    error NotInWindow();
    error AlreadyAttested();

    constructor(
        address _registry,
        address _membership,
        address _cabinet
    ) ERC721("Technodemocracy Census Stamp", "TDCEN") {
        require(_registry != address(0), "Census: zero registry");
        require(_membership != address(0), "Census: zero membership");
        require(_cabinet != address(0), "Census: zero cabinet");

        registry = PartyRegistry(_registry);
        membership = MembershipNFT(_membership);
        cabinet = Cabinet(_cabinet);

        censusEvents.push();
    }

    function createCensus(
        uint256 _partyId,
        string calldata _name,
        string calldata _stampCID,
        uint256 _startTime,
        uint256 _endTime
    ) external returns (uint256 censusId) {
        if (
            !cabinet.hasPower(_partyId, msg.sender, Cabinet.Power.CensusAdmin)
        ) revert NotAuthorized();
        require(_endTime > _startTime, "Census: bad window");

        censusEvents.push(
            CensusEvent({
                partyId: _partyId,
                name: _name,
                stampCID: _stampCID,
                startTime: _startTime,
                endTime: _endTime,
                attestationCount: 0
            })
        );

        censusId = censusEvents.length - 1;
        emit CensusCreated(censusId, _partyId, _name, _startTime, _endTime);
    }

    function attest(
        uint256 _censusId,
        bytes32 _attestationHash
    ) external returns (uint256 tokenId) {
        require(_censusId > 0 && _censusId < censusEvents.length, "Census: bad id");
        CensusEvent storage ce = censusEvents[_censusId];
        if (!membership.isMember(ce.partyId, msg.sender)) revert NotMember();
        if (
            block.timestamp < ce.startTime || block.timestamp > ce.endTime
        ) revert NotInWindow();
        if (hasAttested[_censusId][msg.sender]) revert AlreadyAttested();

        hasAttested[_censusId][msg.sender] = true;
        ce.attestationCount += 1;

        tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        stamps[tokenId] = Stamp({
            censusId: _censusId,
            partyId: ce.partyId,
            attestationHash: _attestationHash,
            attestedAt: block.timestamp
        });
        stampsOf[msg.sender].push(tokenId);

        emit Attested(_censusId, msg.sender, tokenId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }

    function censusCount() external view returns (uint256) {
        return censusEvents.length;
    }

    function getStampsOf(
        address _member
    ) external view returns (uint256[] memory) {
        return stampsOf[_member];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        Stamp memory s = stamps[tokenId];
        return
            string(
                abi.encodePacked(
                    "data:application/json,{",
                    '"name":"Census Stamp #',
                    tokenId.toString(),
                    '","description":"Soulbound proof-of-attendance / proof-of-residence stamp from a Technodemocracy party census.",',
                    '"attributes":[',
                    '{"trait_type":"Census","value":"',
                    s.censusId.toString(),
                    '"},',
                    '{"trait_type":"Party","value":"',
                    s.partyId.toString(),
                    '"},',
                    '{"trait_type":"Attested At","value":"',
                    s.attestedAt.toString(),
                    '"}',
                    "]}"
                )
            );
    }
}
