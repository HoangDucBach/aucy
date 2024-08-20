# NFTAuctionManager Contract Doc

## 📃 Table of Contents
- [NFTAuctionManager Contract Doc](#nftauctionmanager-contract-doc)
  - [📃 Table of Contents](#-table-of-contents)
  - [💬 Overview](#-overview)
  - [🔧 Installation](#-installation)
  - [🏗️ Struct Definitions](#️-struct-definitions)
    - [🏷️ Auction](#️-auction)
    - [💰 Bid](#-bid)
    - [💵 Receiver](#-receiver)
  - [📘 Usage](#-usage)
    - [Auction Operators](#auction-operators)
      - [Get Auction](#get-auction)
      - [Get Auctions](#get-auctions)
      - [Get Receivers](#get-receivers)
      - [Get Percentages](#get-percentages)
    - [Seller Operators](#seller-operators)
      - [Create Auction](#create-auction)
      - [End auction](#end-auction)
      - [Cancel auction](#cancel-auction)
    - [Bidder Operators](#bidder-operators)
      - [Place Bid](#place-bid)
      - [Withdraw Bid](#withdraw-bid)
      - [Get Highest Bid](#get-highest-bid)
    - [Get Highest Bidder](#get-highest-bidder)
    - [Donor Operators](#donor-operators)
      - [Donate](#donate)
      - [Get Donors](#get-donors)
    - [Receiver Operators](#receiver-operators)
      - [Add Receiver](#add-receiver)
      - [Remove Receiver](#remove-receiver)
      - [Transfer Money](#transfer-money)
  - [📍 Contract Address and ID](#-contract-address-and-id)
  - [📜 License](#-license)

## 💬 Overview

The NFTAuctionManager contract allows users to create and manage auctions for NFTs (ERC721 tokens).

🔥 It supports auction creation, bidding, and closing the auction by automatically distributing funds to designated recipients.

🔥 It also supports donors to donate to the auction, which will not be counted in the current bid

⏳ At the end of the auction, the auction funds will be transferred to the recipients according to the specified percentage and the auction assets will be transferred to the winner 🏆

## 🔧 Installation

To use the NFTAuctionManager contract, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo.git
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```
3. Test the contract
    ```bash
    npm hardhat test --network hardhat
    ```
4. Deploy the contract to your preferred blockchain network:

    ```bash
    npx hardhat run ./ignition/modules/NFTAuctionManager.ts --network testnet
    ```
## 🏗️ Struct Definitions

Here are the definitions of the structs used in the NFTAuctionManager contract:

### 🏷️ Auction
```solidity
struct Auction {
    string name;
    string description;
    address tokenAddress;
    uint256 tokenId;
    address topicId;
    uint256 startingPrice;
    uint256 minBidIncrement;
    uint256 endingPrice;
    uint256 endingAt;
    address[] receivers;
    uint16[] percentages;
}
```

### 💰 Bid
```solidity
struct Bid {
    address bidder;
    uint256 amount;
    uint256 timestamp;
}
```

### 💵 Receiver
```solidity
struct Receiver {
    address receiverAddress;
    uint16 percentage;
}
```
## 📘 Usage

To interact with the NFTAuctionManager contract, you can use the following functions:

### Auction Operators

#### Get Auction
```solidity
function getAuction(
    address _auctionId
) external view returns (Auction memory) {
    return auctions[_auctionId];
}
```
#### Get Auctions
```solidity
function getAuctions() external view returns (Auction[] memory) {
    Auction[] memory _auctions = new Auction[](auctionIds.length);
    for (uint256 i = 0; i < auctionIds.length; i++) {
        _auctions[i] = auctions[auctionIds[i]];
    }
    return _auctions;
}
```
#### Get Receivers
```solidity
function getReceivers(address _auctionId) override external view returns (address[] memory) {
    return auctions[_auctionId].receivers;
}
```

#### Get Percentages
```solidity
function getPercentages(address _auctionId) override external view returns (uint16[] memory) {
    return auctions[_auctionId].percentages;
}
```
### Seller Operators

#### Create Auction
```solidity
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
) external onlyNFTOwner(_tokenAddress, _tokenId) returns (address)
```

#### End auction
```solidity
function endAuction(address _auctionId) external returns (bool);
```
#### Cancel auction
```solidity
function cancelAuction(address _auctionId) external returns (bool);
```

### Bidder Operators

#### Place Bid
```solidity
function placeBid(
    address _auctionId
) external payable returns (bool);
```

#### Withdraw Bid
```solidity
function withdrawBid(address _auctionId) external payable returns (bool);
```

#### Get Highest Bid
```solidity
function getHighestBid(address _auctionId) external view returns (uint256);
```

### Get Highest Bidder
```solidity
function getHighestBidder(
    address _auctionId
) external view returns (address);
```

### Donor Operators

#### Donate
```solidity
function donate(address _auctionId) external payable;
```
#### Get Donors
```solidity
function getDonors(address _auctionId) external view returns (address[] memory);
```
### Receiver Operators

#### Add Receiver
```solidity
function addReceiver(
    address _auctionId,
    address _receiver,
    uint16 _percentage
) external;
```

#### Remove Receiver
```solidity
function removeReceiver(address _auctionId, address _receiver) external;
```

#### Transfer Money
```solidity
function transferMoney(
    address _auctionId,
    address _receiver,
    uint256 _amount
) external;
```
## 📍 Contract Address and ID

To interact with the NFTAuctionManager contract, you will need the contract address and ID. Here is an example:

- **Contract Address:** `0x01786227BD70c5A763375D808ec13270c8C60255`
- **Contract ID [On Hedera]:** `0.0.4657519`
  
## 📜 License

This project does not have a license.