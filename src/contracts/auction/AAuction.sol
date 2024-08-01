// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Internal imports
import "./IAuction.sol";
import "./ISeller.sol";
import "./IBidder.sol";

abstract contract AAuction is IAuction, ISeller, IBidder {
    mapping(address => Auction) public auctions;
    /**
     * @dev Donation is given in addition to the winner, this is a separate amount not included in the highest bid
     */
    uint256 public donation = 0;

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
