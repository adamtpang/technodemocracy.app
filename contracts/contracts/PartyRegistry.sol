// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PartyRegistry
 * @notice The source of truth for party existence on Technodemocracy.
 *
 *         Universal candidacy: any wallet may found a party (just like any
 *         wallet may deploy an ERC-20). The founder is the initial president;
 *         subsequent presidents are elected via the Election contract.
 *
 *         This contract holds only metadata. Membership is owned by
 *         MembershipNFT, franchise grants by Franchise, norms by
 *         NormsRegistry, etc. Each subsystem reads `partyPresident()` to
 *         enforce president-only operations.
 */
contract PartyRegistry {
    struct Party {
        string name;
        string description;
        string metadataCID;
        address founder;
        address president;
        uint256 foundedAt;
        bool active;
    }

    Party[] public parties;
    address public electionContract;
    uint256 public founderFee;
    address public admin;

    event PartyFounded(
        uint256 indexed partyId,
        address indexed founder,
        string name,
        string metadataCID
    );
    event PartyMetadataUpdated(uint256 indexed partyId, string metadataCID);
    event PresidentChanged(
        uint256 indexed partyId,
        address indexed previous,
        address indexed next
    );
    event PartyDeactivated(uint256 indexed partyId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "PartyRegistry: not admin");
        _;
    }

    modifier onlyPresident(uint256 _partyId) {
        require(
            msg.sender == parties[_partyId].president,
            "PartyRegistry: not president"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
        parties.push(
            Party({
                name: "",
                description: "",
                metadataCID: "",
                founder: address(0),
                president: address(0),
                foundedAt: 0,
                active: false
            })
        );
    }

    function setAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }

    function setElectionContract(address _election) external onlyAdmin {
        electionContract = _election;
    }

    function setFounderFee(uint256 _fee) external onlyAdmin {
        founderFee = _fee;
    }

    function withdrawFees(address payable _to) external onlyAdmin {
        _to.transfer(address(this).balance);
    }

    function deactivateParty(uint256 _partyId) external onlyAdmin {
        require(_partyId > 0 && _partyId < parties.length, "PartyRegistry: invalid id");
        parties[_partyId].active = false;
        emit PartyDeactivated(_partyId);
    }

    /// @notice Any wallet may found a party. Caller becomes the initial
    ///         president and is recorded as the immutable founder.
    function createParty(
        string calldata _name,
        string calldata _description,
        string calldata _metadataCID
    ) external payable returns (uint256 partyId) {
        require(msg.value >= founderFee, "PartyRegistry: founder fee");
        require(bytes(_name).length > 0, "PartyRegistry: empty name");

        parties.push(
            Party({
                name: _name,
                description: _description,
                metadataCID: _metadataCID,
                founder: msg.sender,
                president: msg.sender,
                foundedAt: block.timestamp,
                active: true
            })
        );

        partyId = parties.length - 1;
        emit PartyFounded(partyId, msg.sender, _name, _metadataCID);
    }

    function updateMetadata(
        uint256 _partyId,
        string calldata _metadataCID
    ) external onlyPresident(_partyId) {
        parties[_partyId].metadataCID = _metadataCID;
        emit PartyMetadataUpdated(_partyId, _metadataCID);
    }

    function setPresident(uint256 _partyId, address _newPresident) external {
        require(
            msg.sender == electionContract ||
                msg.sender == parties[_partyId].president,
            "PartyRegistry: not authorized"
        );
        require(_newPresident != address(0), "PartyRegistry: zero president");

        address previous = parties[_partyId].president;
        parties[_partyId].president = _newPresident;
        emit PresidentChanged(_partyId, previous, _newPresident);
    }

    function partyCount() external view returns (uint256) {
        return parties.length;
    }

    function partyPresident(uint256 _partyId) external view returns (address) {
        return parties[_partyId].president;
    }

    function partyFounder(uint256 _partyId) external view returns (address) {
        return parties[_partyId].founder;
    }

    function partyFoundedAt(uint256 _partyId) external view returns (uint256) {
        return parties[_partyId].foundedAt;
    }

    function isActive(uint256 _partyId) external view returns (bool) {
        if (_partyId == 0 || _partyId >= parties.length) return false;
        return parties[_partyId].active;
    }

    function getParty(uint256 _partyId) external view returns (Party memory) {
        return parties[_partyId];
    }
}
