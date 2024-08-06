// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

/// @title An Auction contract for bidding and selling singled and batched NFTs
/// @author Hoang Duc Bach
/// @notice You can use this contract to create an auction for NFTs (support ERC721)

// External imports
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

// Internal imports
import "./AAuction.sol";

contract NFTAuctionManager is Ownable(msg.sender), AAuction, IERC721Receiver {
    /**
     * Modifier to check if the caller is the owner of the NFT
     */
    modifier onlyNFTOwner(address _nftContract, uint256 _tokenId) {
        require(
            IERC721(_nftContract).ownerOf(_tokenId) == msg.sender,
            "Only NFT owner can create an auction"
        );
        _;
    }

    /*
     * Modifier to check owner of auction
     */
    modifier onlyAuctionOwner(address _auctionId) {
        require(
            auctions[_auctionId].seller == msg.sender,
            "Only auction owner can perform this action"
        );
        _;
    }

    function createAuction(
        string memory _name,
        string memory _description,
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _minBidIncrement,
        uint256 _endingPrice,
        uint256 _endingAt,
        address[] memory _receivers,
        uint16[] memory _percentages
    )
        external
        override
        onlyNFTOwner(_tokenAddress, _tokenId)
        returns (address)
    {
        require(
            _receivers.length == _percentages.length,
            "Receivers and percentages length mismatch"
        );
        for (uint256 i = 0; i < _receivers.length; i++) {
            require(_receivers[i] != address(0), "Invalid receiver address");
            require(
                _percentages[i] > 0 && _percentages[i] <= 100,
                "Percentage must be between 1 and 100"
            );
        }

        address auctionId = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            block.timestamp,
                            msg.sender,
                            _tokenAddress,
                            _tokenId
                        )
                    )
                )
            )
        );
        // Assert that the auctionId is not already used
        assert(auctions[auctionId].seller == address(0));

        auctionIds.push(auctionId);
        auctions[auctionId] = Auction({
            name: _name,
            description: _description,
            seller: msg.sender,
            tokenAddress: _tokenAddress,
            tokenId: _tokenId,
            startingPrice: _startingPrice,
            minBidIncrement: _minBidIncrement,
            endingPrice: _endingPrice,
            startedAt: block.timestamp,
            endingAt: _endingAt,
            endedAt: 0,
            highestBid: 0,
            highestBidder: address(0),
            donation: 0,
            receivers: _receivers,
            percentages: _percentages
        });

        // Assert that the auction was created correctly
        assert(auctions[auctionId].seller == msg.sender);
        assert(auctions[auctionId].tokenAddress == _tokenAddress);
        assert(auctions[auctionId].tokenId == _tokenId);
        assert(auctions[auctionId].startingPrice == _startingPrice);
        assert(auctions[auctionId].minBidIncrement == _minBidIncrement);
        assert(auctions[auctionId].endingPrice == _endingPrice);
        assert(auctions[auctionId].startedAt == block.timestamp);
        assert(auctions[auctionId].endingAt == _endingAt);
        assert(auctions[auctionId].endedAt == 0);
        assert(auctions[auctionId].highestBid == 0);
        assert(auctions[auctionId].highestBidder == address(0));
        assert(auctions[auctionId].donation == 0);
        assert(auctions[auctionId].receivers.length == _receivers.length);
        assert(auctions[auctionId].percentages.length == _percentages.length);

        // Emit an event to notify that an auction has been created
        emit AuctionCreated(
            auctionId,
            msg.sender,
            _tokenAddress,
            _tokenId,
            _startingPrice,
            block.timestamp
        );

        // Return the address of the created auction
        return auctionId;
    }

    /**
     * @dev Ends an ongoing auction.
     * @param _auctionId The address of the auction to be ended.
     * @return A boolean indicating whether the auction was successfully ended.
     */
    function endAuction(
        address _auctionId
    ) external override onlyAuctionOwner(_auctionId) returns (bool) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Only the seller can end the auction
        require(
            auction.seller == msg.sender,
            "Only the seller can end the auction"
        );

        // Check if the auction duration has ended
        require(
            auction.endedAt > 0 || block.timestamp >= auction.endingAt,
            "Auction is not ended"
        );
        // Update endedAt
        auction.endedAt = block.timestamp;

        // Transfer money to receivers
        uint256 totalMoney = auction.highestBid + auction.donation;

        // Distribute money to receivers
        for (uint256 i = 0; i < auction.receivers.length; i++) {
            uint256 amount = (totalMoney * auction.percentages[i]) / 100;
            payable(auction.receivers[i]).transfer(amount);
        }

        // Transfer the NFT to the highest bidder

        // Ensure the contract has approval to transfer the token
        require(
            IERC721(auction.tokenAddress).getApproved(auction.tokenId) ==
                address(this) ||
                IERC721(auction.tokenAddress).isApprovedForAll(
                    auction.seller,
                    address(this)
                ),
            "Contract is not approved to transfer the token"
        );

        IERC721(auction.tokenAddress).transferFrom(
            auction.seller,
            auction.highestBidder,
            auction.tokenId
        );

        // Emit an event to notify that the auction has ended
        emit AuctionEnded(
            _auctionId,
            auction.highestBid,
            auction.highestBidder,
            block.timestamp
        );

        // Return true to indicate that the auction was successfully ended
        return true;
    }

    /**
     * @dev Cancels an ongoing auction.
     * @param _auctionId The address of the auction to be canceled.
     * @return A boolean indicating whether the auction was successfully canceled.
     */
    function cancelAuction(
        address _auctionId
    ) external override onlyAuctionOwner(_auctionId) returns (bool) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Only the seller can cancel the auction
        require(
            auction.seller == msg.sender,
            "Only the seller can cancel the auction"
        );

        // Update endedAt
        auction.endedAt = block.timestamp;

        // Emit an event to notify that the auction has been canceled
        emit AuctionCancelled(_auctionId, block.timestamp);

        // Return true to indicate that the auction was successfully canceled
        return true;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        // Prevent warning unsed variable
        operator;
        from;
        tokenId;
        data;
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }

    function placeBid(
        address _auctionId,
        uint256 _amount
    ) external payable override onlyAuctionOnGoing(_auctionId) returns (bool) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Check if the bid amount is greater than the highest bid
        require(
            _amount > auction.highestBid,
            "Bid amount is not greater than the highest bid"
        );

        // Check if the bid amount is greater than the starting price
        require(
            _amount >= auction.startingPrice,
            "Bid amount is not greater than the starting price"
        );
        // Check amount is greater than min bid increment
        require(
            _amount >= auction.highestBid + auction.minBidIncrement,
            "Bid amount is not greater than the min bid increment"
        );

        // Check if the bid amount is less than the ending price
        require(
            _amount <= auction.endingPrice,
            "Bid amount is not less than the ending price"
        );

        // Transfer the bid amount to the contract
        require(
            msg.value == _amount,
            "The value sent is not equal to the bid amount"
        );

        // Update the highest bid and highest bidder of the auction
        auction.highestBid = _amount;
        auction.highestBidder = msg.sender;

        // Update bids
        bids[_auctionId][msg.sender] = Bid({
            bidder: msg.sender,
            auctionId: _auctionId,
            amount: _amount,
            timestamp: block.timestamp
        });

        // Emit an event to notify that a bid has been placed
        emit BidPlaced(msg.sender, _auctionId, _amount, block.timestamp);

        // Return true to indicate that the bid was successfully placed
        return true;
    }

    function withdrawBid(
        address _auctionId
    ) external payable override onlyAuctionOnGoing(_auctionId) returns (bool) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Check if the bidder has placed a bid
        require(
            auction.highestBidder == msg.sender,
            "Bidder has not placed a bid"
        );

        // Emit an event to notify that a bid has been withdrawn
        emit BidWithdrawn(
            msg.sender,
            _auctionId,
            auction.highestBid,
            block.timestamp
        );
        // Update bids
        delete bids[_auctionId][msg.sender];

        // Update the highest bid and highest bidder of the auction
        auction.highestBid = 0;
        auction.highestBidder = address(0);
        // Return true to indicate that the bid was successfully withdrawn
        return true;
    }

    function getHighestBid(
        address _auctionId
    ) external view override returns (uint256) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Return the highest bid amount of the auction
        return auction.highestBid;
    }

    function getHighestBidder(
        address _auctionId
    ) external view override returns (address) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Return the highest bidder of the auction
        return auction.highestBidder;
    }

    /*
    || Donatable functions
     */

    function donate(address _auctionId) external payable override {
        require(msg.value > 0, "The value sent is not greater than 0");

        // Update the donation amount
        auctions[_auctionId].donation += msg.value;

        // Emit an event to log the donation
        emit Donation(msg.sender, msg.value, block.timestamp);

        // Update donors
        donors[_auctionId][msg.sender] += msg.value;
    }

    /*
    || RECEIVER FUNCTIONS
    */
    function addReceiver(
        address _auctionId,
        address _receiver,
        uint16 _percentage
    ) external override {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Only the auction owner can add a receiver
        require(
            auction.seller == msg.sender,
            "Only the auction owner can add a receiver"
        );

        // Check if the receiver is not the auction owner
        require(
            _receiver != auction.seller,
            "The receiver cannot be the auction owner"
        );

        // Check if the receiver is not already added
        for (uint256 i = 0; i < auction.receivers.length; i++) {
            require(
                auction.receivers[i] != _receiver,
                "The receiver is already added"
            );
        }

        // Check if the percentage is between 1 and 100
        require(
            _percentage > 0 && _percentage <= 100,
            "Percentage must be between 1 and 100"
        );

        // Check sum of percentages is less than or equal to 100
        uint16 sum = 0;
        for (uint256 i = 0; i < auction.percentages.length; i++) {
            sum += auction.percentages[i];
        }
        require(
            sum + _percentage <= 100,
            "Sum of percentages is greater than 100"
        );

        // Add the receiver to the auction
        auction.receivers.push(_receiver);
        auction.percentages.push(_percentage);

        // Emit an event to notify that a receiver has been added
        emit ReceiverAdded(_auctionId, _receiver, _percentage, block.timestamp);
    }

    function removeReceiver(
        address _auctionId,
        address _receiver
    ) external override {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Only the auction owner can remove a receiver
        require(
            auction.seller == msg.sender,
            "Only the auction owner can remove a receiver"
        );

        // Check if the receiver is not the auction owner
        require(
            _receiver != auction.seller,
            "The receiver cannot be the auction owner"
        );

        // Check if the receiver is added
        bool isReceiver = false;
        for (uint256 i = 0; i < auction.receivers.length; i++) {
            if (auction.receivers[i] == _receiver) {
                isReceiver = true;
                break;
            }
        }

        require(isReceiver, "The receiver is not added");

        // Remove the receiver from the auction
        for (uint256 i = 0; i < auction.receivers.length; i++) {
            if (auction.receivers[i] == _receiver) {
                auction.receivers[i] = auction.receivers[
                    auction.receivers.length - 1
                ];
                auction.receivers.pop();
                auction.percentages[i] = auction.percentages[
                    auction.percentages.length - 1
                ];
                auction.percentages.pop();
                break;
            }
        }

        // Emit an event to notify that a receiver has been removed
        emit ReceiverRemoved(_auctionId, _receiver, block.timestamp);
    }

    function transferMoney(
        address _auctionId,
        address _receiver,
        uint256 _amount
    ) external override {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Only the auction owner can transfer money
        require(
            auction.seller == msg.sender,
            "Only the auction owner can transfer money"
        );

        // Check if the receiver is added
        bool isReceiver = false;
        uint16 percentage = 0;
        for (uint256 i = 0; i < auction.receivers.length; i++) {
            if (auction.receivers[i] == _receiver) {
                isReceiver = true;
                percentage = auction.percentages[i];
                break;
            }
        }

        require(isReceiver, "The receiver is not added");

        // Calculate the amount to transfer
        uint256 amount = (_amount * percentage) / 100;

        // Transfer the amount to the receiver
        payable(_receiver).transfer(amount);

        // Emit an event to notify that money has been transferred
        emit MoneyTransfered(_auctionId, _receiver, amount, block.timestamp);
    }

    /*
    || RECEIVE AND FALLBACK FUNCTIONS
    */
    receive() external payable {}

    fallback() external payable {}
}
