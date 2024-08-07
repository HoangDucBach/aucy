// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/// @title An interface for a bidder in an auction
/// @author Hoang Duc Bach
/// @notice You can use this contract to create a bidder in an auction
interface IBidder {
    /*
    || STRUCTS
    */

    /**
     * @dev Represents a bid placed by a bidder
     * @param bidder The address of the bidder who is bidding.
     * @param auctionId The ID of the auction to bid.
     * @param amount The amount of the bid.
     * @param timestamp The timestamp when the bid was placed.
     *
     */
    struct Bid {
        address bidder;
        address auctionId;
        uint256 amount;
        uint256 timestamp;
    }

    /*
    || EVENTS
    */

    /**
     * @dev Event to log a bid placed in an auction
     * @param bidder The address of the bidder who placed the bid.
     * @param auctionId The address of the auction where the bid was placed.
     * @param amount The amount of the bid.
     * @param timestamp The timestamp when the bid was placed.
     */
    event BidPlaced(
        address indexed bidder,
        address indexed auctionId,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * Event to log a bid withdrawn from an auction
     * @param bidder The address of the bidder who withdrew the bid.
     * @param auctionId The address of the auction where the bid was withdrawn.
     * @param amount The amount of the bid.
     * @param timestamp The timestamp when the bid was withdrawn.
     */
    event BidWithdrawn(
        address indexed bidder,
        address indexed auctionId,
        uint256 amount,
        uint256 timestamp
    );

    /*
    || FUNCTIONS
    */

    /**
     * @dev Place a bid in an auction
     * @param _auctionId The address of the auction to bid in.
     * @return bool True if the bid is successful
     */
    function placeBid(
        address _auctionId
    ) external payable returns (bool);

    /**
     * @dev Withdraw a bid from an auction
     * @param _auctionId The address of the auction to withdraw the bid from.
     * @return bool True if the bid is successfully withdrawn
     */
    function withdrawBid(address _auctionId) external payable returns (bool);

    /**
     * @dev Get the highest bid for a specific auction
     * @param _auctionId The address of the auction.
     * @return uint256 The highest bid amount
     */
    function getHighestBid(address _auctionId) external view returns (uint256);

    /**
     * @dev Get the highest bidder for a specific auction
     * @param _auctionId The address of the auction.
     * @return address The address of the highest bidder
     */
    function getHighestBidder(
        address _auctionId
    ) external view returns (address);
}
