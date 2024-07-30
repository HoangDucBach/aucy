// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

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

    event BidPlaced(
        address indexed bidder,
        address indexed auctionId,
        uint256 amount,
        uint256 timestamp
    );

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
     * @param _amount The amount to bid.
     * @return bool True if the bid is successful
     */
    function placeBid(
        address _auctionId,
        uint256 _amount
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
