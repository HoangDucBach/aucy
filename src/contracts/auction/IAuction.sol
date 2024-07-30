// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// External imports

// Internal imports

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

    event AuctionCreated(
        address auctionId,
        uint256 tokenId,
        address seller,
        uint256 startingPrice,
        uint256 endingPrice,
        uint32 bidPeriod,
        uint256 duration,
        uint256 startedAt
    );

    event AuctionEnded(
        address auctionId,
        uint256 tokenId,
        address seller,
        uint256 highestBid,
        address highestBidder,
        uint256 endedAt
    );

    event AuctionCancelled(
        address auctionId,
        uint256 tokenId,
        address seller,
        uint256 endedAt
    );
}
