// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/// @title An interface for a receiver in an auction
/// @author Hoang Duc Bach
/// @notice This interface allow a auction transfer all the money to the receiver

interface IReceiver {
    /*
    || EVENTS
    */

    /**
     * @dev Event to log a money transfered to the receiver
     * @param auctionId The address of the auction where the money was transfered.
     * @param receiver The address of the receiver who received the money.
     * @param amount The amount of the money.
     * @param timestamp The timestamp when the money was received.
     */
    event MoneyTransfered(
        address indexed auctionId,
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Event to log a receiver added to the auction
     * @param auctionId The address of the auction where the receiver was added.
     * @param receiver The address of the receiver who was added.
     * @param percentage The percentage of the money to receive.
     * @param timestamp The timestamp when the receiver was added.
     */
    event ReceiverAdded(
        address indexed auctionId,
        address indexed receiver,
        uint16 percentage,
        uint256 timestamp
    );

    /**
     * @dev Event to log a receiver removed from the auction
     * @param auctionId The address of the auction where the receiver was removed.
     * @param receiver The address of the receiver who was removed.
     * @param timestamp The timestamp when the receiver was removed.
     */
    event ReceiverRemoved(
        address indexed auctionId,
        address indexed receiver,
        uint256 timestamp
    );
    /*
    || FUNCTIONS
    */

    /**
     * @dev Add a receiver to the auction
     * @param _auctionId The address of the auction where the receiver will be added.
     * @param _receiver The address of the receiver to add.
     * @param _percentage The percentage of the money to receive.
     */
    function addReceiver(
        address _auctionId,
        address _receiver,
        uint16 _percentage
    ) external;

    /**
     * @dev Remove a receiver from the auction
     * @param _auctionId The address of the auction where the receiver will be removed.
     * @param _receiver The address of the receiver to remove.
     */
    function removeReceiver(address _auctionId, address _receiver) external;

    /**
     * @dev Transfer money to the receiver
     * @param _auctionId The address of the auction where the money will be transfered.
     * @param _receiver The address of the receiver who will receive the money.
     * @param _amount The amount of the money to transfer.
     */
    function transferMoney(
        address _auctionId,
        address _receiver,
        uint256 _amount
    ) external;
}
