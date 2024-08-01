// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// External imports

// Internal imports
import "./ERCType.sol";

/**
 * @title IAuction
 * @dev Interface for Auction contract, need to implement this contract to create an auction
 * @notice You can use this contract to create an auction for NFTs (support ERC721)
 */
interface IAuction {
    /*
    || STRUCTS
    */

    /**
     * @dev Create an auction for a single NFT
     * @param seller The address of the seller who is auctioning the item.
     * @param tokenAddress The address of the NFT seller.
     * @param tokenId The ID of the token to auction.
     * @param startingPrice The starting price of the auction.
     * @param endingPrice The ending price of the auction.
     * @param bidPeriod The period during which bids can be placed.
     * @param duration The total duration of the auction.
     * @param startedAt The timestamp when the auction started.
     * @param highestBid The highest bid of the auction.
     * @param highestBidder The address of the highest bidder.
     *
     */
    struct Auction {
        address seller;
        address tokenAddress;
        uint256 tokenId;
        uint256 startingPrice;
        uint256 endingPrice;
        uint32 bidPeriod;
        uint256 duration;
        uint256 startedAt;
        uint256 endedAt;
        uint256 highestBid;
        address highestBidder;
    }

    /*
    || EVENTS
    */

    /**
     * @dev Event to log an auction created
     * @param auctionId The address of the auction created.
     * @param seller The address of the seller who is auctioning the item.
     * @param startingPrice The starting price of the auction.
     * @param endingPrice The ending price of the auction.
     * @param bidPeriod The period during which bids can be placed.
     * @param duration The total duration of the auction.
     * @param startedAt The timestamp when the auction started.
     */
    event AuctionCreated(
        address auctionId,
        address seller,
        uint256 startingPrice,
        uint256 endingPrice,
        uint32 bidPeriod,
        uint256 duration,
        uint256 startedAt
    );

 
    /**
     * @dev Event to log an auction ended
     * @param auctionId The address of the auction where the bid was placed.
     * @param highestBid The highest bid of the auction.
     * @param highestBidder The address of the highest bidder.
     * @param endedAt The timestamp when the auction ended.
     */
    event AuctionEnded(
        address auctionId,
        uint256 highestBid,
        address highestBidder,
        uint256 endedAt
    );

    /**
     * @dev Event to log an auction cancelled
     * @param auctionId The address of the auction where the bid was placed.
     * @param endedAt The timestamp when the auction ended.
     */
    event AuctionCancelled(
        address auctionId,
        uint256 endedAt
    );
}
