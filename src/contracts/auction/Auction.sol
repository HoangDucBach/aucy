// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Internal imports
import "./IAuction.sol";
import "./ISeller.sol";
import "./IBidder.sol";

abstract contract Auction is IAuction, ISeller, IBidder {
    mapping(address => Auction) public auctions;

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
                auctions[_auctionId].endedAt == 0,
            "Auction is not on going"
        );
        _;
    }
    
}
