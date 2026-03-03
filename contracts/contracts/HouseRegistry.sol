// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract HouseRegistry {
    // ---------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------

    struct House {
        string name;
        string description;
        uint256 createdAt;
        bool active;
    }

    // ---------------------------------------------------------------
    // State
    // ---------------------------------------------------------------

    House[] public houses;

    /// @notice Maps a member address to its houseId (1-indexed).
    ///         A value of 0 means the address is not in any house.
    mapping(address => uint256) public memberToHouse;

    /// @notice Members list for each house (1-indexed houseId).
    mapping(uint256 => address[]) public houseMembers;

    /// @notice Amount of USDC required to stake when joining a house.
    uint256 public stakeAmount;

    /// @notice USDC token contract.
    IERC20 public usdc;

    /// @notice Admin address (set once in constructor).
    address public admin;

    // ---------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------

    event HouseCreated(uint256 indexed houseId, string name);
    event MemberJoined(uint256 indexed houseId, address indexed member);
    event MemberLeft(uint256 indexed houseId, address indexed member);

    // ---------------------------------------------------------------
    // Modifiers
    // ---------------------------------------------------------------

    modifier onlyAdmin() {
        require(msg.sender == admin, "HouseRegistry: caller is not admin");
        _;
    }

    // ---------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------

    /// @param _usdc  Address of the USDC (or MockUSDC) token contract.
    /// @param _stakeAmount  Amount of USDC (in smallest unit) required to
    ///        join a house.  Pass 10e6 for 10 USDC.
    constructor(address _usdc, uint256 _stakeAmount) {
        require(_usdc != address(0), "HouseRegistry: zero USDC address");
        admin = msg.sender;
        usdc = IERC20(_usdc);
        stakeAmount = _stakeAmount;

        // Push a dummy house at index 0 so that valid house IDs start at 1.
        // This lets us use memberToHouse == 0 to mean "no house".
        houses.push(
            House({
                name: "",
                description: "",
                createdAt: 0,
                active: false
            })
        );
    }

    // ---------------------------------------------------------------
    // Admin functions
    // ---------------------------------------------------------------

    /// @notice Creates a new house.  Only callable by the admin.
    function createHouse(
        string calldata _name,
        string calldata _description
    ) external onlyAdmin {
        houses.push(
            House({
                name: _name,
                description: _description,
                createdAt: block.timestamp,
                active: true
            })
        );

        uint256 houseId = houses.length - 1;
        emit HouseCreated(houseId, _name);
    }

    // ---------------------------------------------------------------
    // Member functions
    // ---------------------------------------------------------------

    /// @notice Join a house by staking USDC.
    /// @param _houseId  The 1-indexed house ID to join.
    function joinHouse(uint256 _houseId) external {
        require(
            _houseId > 0 && _houseId < houses.length,
            "HouseRegistry: invalid house ID"
        );
        require(houses[_houseId].active, "HouseRegistry: house not active");
        require(
            memberToHouse[msg.sender] == 0,
            "HouseRegistry: already in a house"
        );

        // Transfer stake from caller to this contract.
        bool success = usdc.transferFrom(
            msg.sender,
            address(this),
            stakeAmount
        );
        require(success, "HouseRegistry: USDC transfer failed");

        memberToHouse[msg.sender] = _houseId;
        houseMembers[_houseId].push(msg.sender);

        emit MemberJoined(_houseId, msg.sender);
    }

    /// @notice Leave the current house and reclaim the staked USDC.
    function leaveHouse() external {
        uint256 houseId = memberToHouse[msg.sender];
        require(houseId != 0, "HouseRegistry: not in a house");

        // Remove member from the houseMembers array (swap-and-pop).
        address[] storage members = houseMembers[houseId];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }

        memberToHouse[msg.sender] = 0;

        // Return staked USDC.
        bool success = usdc.transfer(msg.sender, stakeAmount);
        require(success, "HouseRegistry: USDC refund failed");

        emit MemberLeft(houseId, msg.sender);
    }

    // ---------------------------------------------------------------
    // View helpers
    // ---------------------------------------------------------------

    /// @notice Returns the total number of houses (including the dummy at 0).
    function getHouseCount() external view returns (uint256) {
        return houses.length;
    }

    /// @notice Returns the member list for a given house.
    function getHouseMembers(
        uint256 _houseId
    ) external view returns (address[] memory) {
        return houseMembers[_houseId];
    }

    /// @notice Returns the house ID for a given member (0 = no house).
    function getMemberHouse(address _member) external view returns (uint256) {
        return memberToHouse[_member];
    }
}
