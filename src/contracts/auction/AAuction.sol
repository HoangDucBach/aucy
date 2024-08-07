// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Internal imports
import "./IAuction.sol";
import "./ISeller.sol";
import "./IBidder.sol";
import "./IReceiver.sol";
import "./Donatable.sol";

/// @title An abstract contract for Auctions
/// @author Hoang Duc Bach
/// @notice You can use this contract to create an auction
/// @dev This contract is an abstract contract for Auctions

abstract contract AAuction is IAuction, ISeller, IBidder, IReceiver, Donatable {
    // Auctions
    /**
     * @notice Auction struct to store auction information
     */
    mapping(address => Auction) public auctions;
    address[] public auctionIds;

    // Bids
    /**
     * @notice Bid struct to store bid information
     */
    mapping(address => mapping(address => Bid)) public bids;

    // Donors
    /**
     * @notice Donors mapping from auction to donor to amount
     */
    mapping(address => mapping(address => uint256)) public donors;

    constructor() {}

    /*
    || MODIFIERS
    */

    /**
     * @dev Modifier to check auction is on going
     */
    modifier onlyAuctionOnGoing(address _auctionId) {
        require(
            auctions[_auctionId].startedAt > 0 &&
                block.timestamp < auctions[_auctionId].endingAt,
            "Auction is not ongoing"
        );
        _;
    }

    /**
     * @dev Modifier to check auction is ended
     */
    modifier onlyAuctionEnded(address _auctionId) {
        require(
            auctions[_auctionId].endedAt > 0 ||
                block.timestamp >= auctions[_auctionId].endingAt,
            "Auction is not ended"
        );
        _;
    }

    /*
    || FUNCTIONS
     */

    function getAuction(
        address _auctionId
    ) external view returns (Auction memory) {
        return auctions[_auctionId];
    }

    function getAuctions() external view returns (Auction[] memory) {
        Auction[] memory _auctions = new Auction[](auctionIds.length);
        for (uint256 i = 0; i < auctionIds.length; i++) {
            _auctions[i] = auctions[auctionIds[i]];
        }
        return _auctions;
    }

    function getReceivers(address _auctionId) override external view returns (address[] memory) {
        return auctions[_auctionId].receivers;
    }

    function getPercentages(address _auctionId) override external view returns (uint16[] memory) {
        return auctions[_auctionId].percentages;
    }
}
