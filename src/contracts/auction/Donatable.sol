// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/// @title An interface Donatable contract
/// @author Hoang Duc Bach
/// @notice You can use this contract to donate to a charity
/// @dev This contract is an interface for Donatable contract

interface Donatable {
    /*
    || EVENTS
    */

    /**
     * @dev Event to log a donation
     * @param donor The address of the donor who donated.
     * @param amount The amount of the donation.
     * @param timestamp The timestamp when the donation was made.
     */
    event Donation(address indexed donor, uint256 amount, uint256 timestamp);

    /*
    || FUNCTIONS
    */


    /**
     * @dev Donate to a charity
     * @param _auctionId The address of the auction to donate.
     */
    function donate(address _auctionId) external payable;
}
