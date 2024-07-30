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
import "./Auction.sol";

contract NFTAuctionManager is Ownable(msg.sender), Auction, IERC721Receiver {
    /*
    || MODIFIERS
     */

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
    function createAuction(
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint32 _bidPeriod,
        uint256 _duration
    ) external override onlyNFTOwner returns (address) {
        address auctionId = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(block.timestamp, msg.sender, _tokenId)
                    )
                )
            )
        );
        auctions[auctionId] = Auction({
            seller: msg.sender,
            tokenId: _tokenId,
            startingPrice: _startingPrice,
            endingPrice: _endingPrice,
            bidPeriod: _bidPeriod,
            duration: _duration,
            startedAt: block.timestamp,
            endedAt: 0,
            highestBid: 0,
            highestBidder: address(0)
        });

        // Emit an event to notify that an auction has been created
        emit AuctionCreated(
            auctionId,
            _tokenId,
            msg.sender,
            _startingPrice,
            _endingPrice,
            _bidPeriod,
            _duration,
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
    ) external override onlyNFTOwner returns (bool) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Only the seller can end the auction
        require(
            auction.seller == msg.sender,
            "Only the seller can end the auction"
        );

        // Check if the auction duration has ended
        require(
            block.timestamp >= auction.startedAt + auction.duration,
            "Auction duration has not ended"
        );

        // Update the endedAt timestamp of the auction
        auction.endedAt = block.timestamp;

        // Emit an event to notify that the auction has ended
        emit AuctionEnded(
            _auctionId,
            auction.tokenId,
            auction.seller,
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
    ) external override onlyNFTOwner returns (bool) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Only the seller can cancel the auction
        require(
            auction.seller == msg.sender,
            "Only the seller can cancel the auction"
        );

        // Update the endedAt timestamp of the auction
        auction.endedAt = block.timestamp;

        // Emit an event to notify that the auction has been canceled
        emit AuctionCancelled(
            _auctionId,
            auction.tokenId,
            auction.seller,
            block.timestamp
        );

        // Return true to indicate that the auction was successfully canceled
        return true;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }

    function placeBid(
        address _auctionId,
        uint256 _amount
    ) external override payable returns (bool) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Check if the auction is ongoing
        require(
            auction.startedAt + auction.duration > block.timestamp,
            "Auction is not ongoing"
        );

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

        // Emit an event to notify that a bid has been placed
        emit BidPlaced(
            msg.sender,
            _auctionId,
            _amount,
            block.timestamp
        );

        // Return true to indicate that the bid was successfully placed
        return true;
    }

    function withdrawBid(address _auctionId) external override payable returns (bool) {
        // Retrieve the auction from the auctions mapping
        Auction storage auction = auctions[_auctionId];

        // Check if the auction is ongoing
        require(
            auction.startedAt + auction.duration > block.timestamp,
            "Auction is not ongoing"
        );

        // Check if the bidder has placed a bid
        require(
            auction.highestBidder == msg.sender,
            "Bidder has not placed a bid"
        );

        // Transfer the bid amount back to the bidder
        payable(msg.sender).transfer(auction.highestBid);

        // Update the highest bid and highest bidder of the auction
        auction.highestBid = 0;
        auction.highestBidder = address(0);

        // Emit an event to notify that a bid has been withdrawn
        emit BidWithdrawn(
            msg.sender,
            _auctionId,
            auction.highestBid,
            block.timestamp
        );

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
}
