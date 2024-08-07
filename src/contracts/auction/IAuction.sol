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
     * @param id The address of the auction.
     * @param topicId The address of the topic.
     * @param name The name of the auction.
     * @param description The description of the auction.
     * @param seller The address of the seller who is auctioning the item.
     * @param tokenAddress The address of the NFT seller.
     * @param tokenId The ID of the token to auction.
     * @param startingPrice The starting price of the auction.
     * @param minBidIncrement The minimum bid increment of the auction.
     * @param endingPrice The ending price of the auction.
     * @param startedAt The timestamp when the auction started.
     * @param endingAt The timestamp when the auction will end.
     * @param endedAt The timestamp when the auction ended.
     * @param highestBid The highest bid of the auction.
     * @param highestBidder The address of the highest bidder.
     * @param donation The donation amount.
     * @param receivers The addresses of the receivers who will receive the money.
     * @param percentages The percentages of the money to receive.
     *
     */
    struct Auction {
        address id;
        address topicId;
        string name;
        string description;
        address seller;
        address tokenAddress;
        uint256 tokenId;
        uint256 startingPrice;
        uint256 minBidIncrement;
        uint256 endingPrice;
        uint256 startedAt;
        uint256 endingAt;
        uint256 endedAt;
        uint256 highestBid;
        address highestBidder;
        uint256 donation;
        address[] receivers;
        uint16[] percentages;
    }

    /*
    || REQUIRE FUNCTIONS
    */
    /**
     * @dev Get the receiver of the auction
     * @param _auctionId The address of the auction.
     */
    function getReceivers(
        address _auctionId
    ) external view returns (address[] memory);

    /**
     * @dev Get the percentage of the auction
     * @param _auctionId The address of the auction.
     */
    function getPercentages(
        address _auctionId
    ) external view returns (uint16[] memory);

    /*
    || EVENTS
    */

    /**
     * @dev Event to log an auction created
     * @param auctionId The address of the auction created.
     * @param seller The address of the seller who is auctioning the item.
     * @param tokenAddress The address of the NFT seller.
     * @param tokenId The ID of the token to auction.
     */
    event AuctionCreated(
        address auctionId,
        address seller,
        address tokenAddress,
        uint256 tokenId
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
    event AuctionCancelled(address auctionId, uint256 endedAt);
}
