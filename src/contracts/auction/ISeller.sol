// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ISeller {
    /*
    || FUNCTIONS
    */

    /**
     * @dev Create an auction
     * @param _tokenId The ID of the token to auction.
     * @param _startingPrice The starting price of the auction.
     * @param _endingPrice The ending price of the auction.
     * @param _bidPeriod The period during which bids can be placed.
     * @param _duration The total duration of the auction.
     * @return address The address of the created auction
     */
    function createAuction(
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint32 _bidPeriod,
        uint256 _duration
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
     * @return bool True if the auction is cancelled
     */
    function cancelAuction(address _auctionId) external returns (bool);
}
