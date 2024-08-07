// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Internal imports
import "./Helpers.sol";

interface ISeller {
    /*
    || FUNCTIONS
    */

    /**
     * @dev Create an auction
     * @param _name The name of the auction.
     * @param _description The description of the auction.
     * @param _tokenAddress The address of the NFT seller.
     * @param _tokenId The ID of the token to auction.
     * @param _topicId The address of the topic.
     * @param _startingPrice The starting price of the auction.
     * @param _startingPrice The starting price of the auction.
     * @param _minBidIncrement The minimum bid increment of the auction.
     * @param _endingPrice The ending price of the auction.
     * @param _endingAt The time when the auction will end.
     * @return address The address of the created auction
     */
    function createAuction(
        string memory _name,
        string memory _description,
        address _tokenAddress,
        uint256 _tokenId,
        address _topicId,
        uint256 _startingPrice,
        uint256 _minBidIncrement,
        uint256 _endingPrice,
        uint256 _endingAt,
        address[] memory _receivers,
        uint16[] memory _percentages
    ) external returns (address);

    /**
     * @dev End an auction
     * @param _auctionId The address of the auction to end.
     * @return bool True if the auction is ended
     */
    function endAuction(address _auctionId) external returns (bool);

    /**
     * @dev Cancel an auction
     * @param _auctionId The address of the auction to cancel.
     */
    function cancelAuction(address _auctionId) external returns (bool);
}
