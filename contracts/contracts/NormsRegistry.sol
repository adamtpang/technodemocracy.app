// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PartyRegistry.sol";

/**
 * @title NormsRegistry
 * @notice On-chain norms for each party. Joining requires agreement; slashing
 *         requires the resolver to cite a specific (version, contentHash).
 */
contract NormsRegistry {
    struct NormsVersion {
        uint256 partyId;
        uint256 version;
        string ipfsCID;
        bytes32 contentHash;
        uint256 publishedAt;
    }

    PartyRegistry public registry;
    mapping(uint256 => NormsVersion[]) public partyNorms;

    event NormsPublished(
        uint256 indexed partyId,
        uint256 indexed version,
        string ipfsCID,
        bytes32 contentHash
    );

    constructor(address _registry) {
        require(_registry != address(0), "NormsRegistry: zero registry");
        registry = PartyRegistry(_registry);
    }

    function publishNorms(
        uint256 _partyId,
        string calldata _ipfsCID,
        bytes32 _contentHash
    ) external returns (uint256 version) {
        require(
            registry.partyPresident(_partyId) == msg.sender,
            "NormsRegistry: not president"
        );
        require(_contentHash != bytes32(0), "NormsRegistry: empty hash");

        version = partyNorms[_partyId].length + 1;
        partyNorms[_partyId].push(
            NormsVersion({
                partyId: _partyId,
                version: version,
                ipfsCID: _ipfsCID,
                contentHash: _contentHash,
                publishedAt: block.timestamp
            })
        );

        emit NormsPublished(_partyId, version, _ipfsCID, _contentHash);
    }

    function currentVersion(uint256 _partyId) public view returns (uint256) {
        return partyNorms[_partyId].length;
    }

    function getCurrentNorms(
        uint256 _partyId
    ) external view returns (NormsVersion memory) {
        uint256 v = currentVersion(_partyId);
        require(v > 0, "NormsRegistry: no norms");
        return partyNorms[_partyId][v - 1];
    }

    function getNorms(
        uint256 _partyId,
        uint256 _version
    ) external view returns (NormsVersion memory) {
        require(
            _version > 0 && _version <= partyNorms[_partyId].length,
            "NormsRegistry: bad version"
        );
        return partyNorms[_partyId][_version - 1];
    }

    function isNormValid(
        uint256 _partyId,
        uint256 _version,
        bytes32 _contentHash
    ) external view returns (bool) {
        if (_version == 0 || _version > partyNorms[_partyId].length) return false;
        return partyNorms[_partyId][_version - 1].contentHash == _contentHash;
    }
}
