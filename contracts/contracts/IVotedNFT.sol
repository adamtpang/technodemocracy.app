// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title IVotedNFT
 * @notice Soulbound ERC-721 receipt minted on every vote. The
 *         cryptographically verifiable equivalent of the "I Voted" sticker.
 *         Anyone can verify on Basescan that the holder cast a real vote.
 */
contract IVotedNFT is ERC721 {
    using Strings for uint256;

    struct Receipt {
        uint256 partyId;
        uint256 proposalId;
        bool support;
        uint256 votedAt;
        address voter;
    }

    address public minter;
    address public admin;

    mapping(uint256 => Receipt) public receipts;
    mapping(address => uint256[]) public receiptsOf;
    uint256 public nextTokenId = 1;

    event ReceiptMinted(
        uint256 indexed tokenId,
        address indexed voter,
        uint256 indexed partyId,
        uint256 proposalId,
        bool support
    );

    error Soulbound();
    error NotMinter();
    error NotAdmin();

    constructor() ERC721("Technodemocracy I Voted", "IVOTED") {
        admin = msg.sender;
    }

    function setMinter(address _minter) external {
        if (msg.sender != admin) revert NotAdmin();
        minter = _minter;
    }

    function mintReceipt(
        address _voter,
        uint256 _partyId,
        uint256 _proposalId,
        bool _support
    ) external returns (uint256 tokenId) {
        if (msg.sender != minter) revert NotMinter();
        require(_voter != address(0), "IVotedNFT: zero voter");

        tokenId = nextTokenId++;
        _safeMint(_voter, tokenId);
        receipts[tokenId] = Receipt({
            partyId: _partyId,
            proposalId: _proposalId,
            support: _support,
            votedAt: block.timestamp,
            voter: _voter
        });
        receiptsOf[_voter].push(tokenId);

        emit ReceiptMinted(tokenId, _voter, _partyId, _proposalId, _support);
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

    function receiptCount(address _voter) external view returns (uint256) {
        return receiptsOf[_voter].length;
    }

    function getReceipts(
        address _voter
    ) external view returns (uint256[] memory) {
        return receiptsOf[_voter];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        Receipt memory r = receipts[tokenId];

        string memory svg = _renderSVG(tokenId, r);
        string memory imageURI = string.concat(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(svg))
        );

        bytes memory json = abi.encodePacked(
            '{"name":"I Voted #',
            tokenId.toString(),
            '","description":"Soulbound, cryptographically verifiable receipt of an onchain vote in a Technodemocracy party.",',
            '"image":"',
            imageURI,
            '","attributes":[',
            '{"trait_type":"Party ID","value":"',
            r.partyId.toString(),
            '"},',
            '{"trait_type":"Proposal ID","value":"',
            r.proposalId.toString(),
            '"},',
            '{"trait_type":"Vote","value":"',
            r.support ? "Yes" : "No",
            '"},',
            '{"trait_type":"Soulbound","value":"true"}',
            "]}"
        );

        return
            string.concat(
                "data:application/json;base64,",
                Base64.encode(json)
            );
    }

    function _renderSVG(
        uint256 _tokenId,
        Receipt memory _r
    ) internal pure returns (string memory) {
        string memory bg = _r.support ? "#10b981" : "#ef4444";
        string memory label = _r.support ? "VOTED YES" : "VOTED NO";

        return
            string.concat(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" font-family="monospace">',
                '<rect width="400" height="400" fill="#0a0a0a"/>',
                '<rect x="20" y="20" width="360" height="360" fill="none" stroke="',
                bg,
                '" stroke-width="3"/>',
                '<text x="200" y="120" text-anchor="middle" fill="white" font-size="22" font-weight="bold">I VOTED</text>',
                '<text x="200" y="160" text-anchor="middle" fill="',
                bg,
                '" font-size="32" font-weight="bold">',
                label,
                "</text>",
                '<text x="200" y="220" text-anchor="middle" fill="#888" font-size="14">PARTY #',
                _r.partyId.toString(),
                "</text>",
                '<text x="200" y="245" text-anchor="middle" fill="#888" font-size="14">PROPOSAL #',
                _r.proposalId.toString(),
                "</text>",
                '<text x="200" y="320" text-anchor="middle" fill="#444" font-size="11">SOULBOUND TOKEN #',
                _tokenId.toString(),
                "</text>",
                '<text x="200" y="350" text-anchor="middle" fill="#666" font-size="10">technodemocracy.app</text>',
                "</svg>"
            );
    }
}
