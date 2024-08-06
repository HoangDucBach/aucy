import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { NFTAuctionManager, ERC721Mock } from "../typechain-types";
import { erc721 } from "../typechain-types/@openzeppelin/contracts/token";

async function deployContractFixture() {
    const ERC721MockFactory = await ethers.getContractFactory("ERC721Mock");
    const erc721Mock = await ERC721MockFactory.deploy("MockNFT", "MNFT") as ERC721Mock;
    await erc721Mock.waitForDeployment();

    const NFTAuctionManagerFactory = await ethers.getContractFactory("NFTAuctionManager");
    const nftAuctionManager = await NFTAuctionManagerFactory.deploy() as NFTAuctionManager;
    await nftAuctionManager.waitForDeployment();

    return { erc721Mock, nftAuctionManager };
}

describe("NFTAuctionManager", function () {
    let erc721Mock: ERC721Mock;
    let nftAuctionManager: NFTAuctionManager;
    let auctionName: string;
    let auctionDescription: string;
    let owner: any;
    let bidder1: any;
    let bidder2: any;
    let receiver1: any;
    let receiver2: any;
    let tokenAddress: string;
    let tokenId: number;
    let startingPrice: any;
    let minBidIncrement: any;
    let endingPrice: any;
    let endingAt: any;
    let receivers: string[];
    let percentages: number[];

    beforeEach(async function () {
        ({ erc721Mock, nftAuctionManager } = await loadFixture(deployContractFixture));
        [owner, receiver1, receiver2, bidder1, bidder2] = await ethers.getSigners();
        auctionName = "Test Auction";
        auctionDescription = "This is a test auction";
        tokenAddress = await erc721Mock.getAddress();
        tokenId = 1;
        startingPrice = ethers.parseEther("1.0");
        minBidIncrement = ethers.parseEther("0.1");
        endingPrice = ethers.parseEther("5.0");
        endingAt = new Date().getTime() + 60; // 60 seconds
        receivers = [receiver1.address, receiver2.address];
        percentages = [50, 50];

        // Transfer the token to the owner
        await erc721Mock.mint(owner.address, tokenId);
        await erc721Mock.connect(owner).transferFrom(owner.address, owner.address, tokenId);

        // Approve the NFTAuctionManager to transfer the token
        await erc721Mock.connect(owner).approve(await nftAuctionManager.getAddress(), tokenId);
    });

    describe("Check ERC721Mock", function () {
        it("should approve the NFTAuctionManager to transfer the NFT", async function () {
            const approvedAddress = await erc721Mock.getApproved(tokenId);
            const nftAuctionManagerAddress = await nftAuctionManager.getAddress();

            expect(approvedAddress).to.equal(nftAuctionManagerAddress);
        });
    });

    describe("Auction Operations", function () {
        it("should create an auction", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receipt = await tx.wait();
            if (!receipt) throw new Error("No receipt");

            const auctionId = receipt?.logs[0]?.args?.auctionId;
            const auction = await nftAuctionManager.auctions(auctionId);
            const auctionDetails = await nftAuctionManager.auctions(auctionId);
            console.log(auctionDetails);

            expect(auction.name, "Name does not match").to.equal(auctionName);
            expect(auction.description, "Description does not match").to.equal(auctionDescription);
            expect(auction.seller, "Seller does not match").to.equal(owner.address);
            expect(auction.startingPrice, "Starting price does not match").to.equal(startingPrice);
            expect(auction.minBidIncrement, "Minimum bid increment does not match").to.equal(minBidIncrement);
            expect(auction.endingPrice, "Ending price does not match").to.equal(endingPrice);
            expect(auction.startedAt, "Started at does not match").to.be.above(0);
            expect(auction.endingAt, "Ended at does not match").to.equal(endingAt);
            expect(auction.endedAt, "Ended at does not match").to.equal(0);
            expect(auction.tokenAddress, "Token address does not match").to.equal(tokenAddress);
            expect(auction.tokenId, "Token ID does not match").to.equal(tokenId);



            expect({ ...auctionDetails }).to.deep.equal({ ...auction });

            expect(receipt.logs[0].fragment.name, "Event name does not match").to.equal("AuctionCreated");
        });

        it("should end an auction", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );

            const initialReceiver1Balance = await ethers.provider.getBalance(receiver1.address);

            const receipt = await tx.wait();
            const auctionId = receipt.logs[0].args.auctionId;

            const bidValue = ethers.parseEther("1.5");
            const bidTx = await nftAuctionManager.connect(bidder1).placeBid(auctionId, bidValue, { value: bidValue });
            await bidTx.wait();

            // Check balance before ending the auction of contract 
            const contractBalanceBefore = await ethers.provider.getBalance(nftAuctionManager.target);
            console.log("Contract Balance Before: ", contractBalanceBefore.toString());

            const currentTime = (await ethers.provider.getBlock('latest'))?.timestamp;
            const timeToIncrease = endingAt - currentTime!;

            await ethers.provider.send("evm_increaseTime", [timeToIncrease]);
            await ethers.provider.send("evm_mine", []);

            const endTx = await nftAuctionManager.connect(owner).endAuction(auctionId);
            const endReceipt = await endTx.wait();
            if (!endReceipt) throw new Error("No receipt");

            const auction = await nftAuctionManager.auctions(auctionId);
            expect(auction.endedAt).to.be.above(0);

            // Check the receiver balance
            const afterReceiver1Balance = await ethers.provider.getBalance(receiver1.address);
            const receiver1Balance = afterReceiver1Balance - initialReceiver1Balance;
            console.log("Initial Receiver1 Balance: ", initialReceiver1Balance.toString());
            console.log("After Receiver1 Balance: ", afterReceiver1Balance.toString());
            console.log("Receiver1 Balance: ", receiver1Balance.toString());
            const halfBidValue = BigInt(bidValue) / BigInt(2);

            expect(receiver1Balance).to.equal(halfBidValue);

            const nftOwner = await erc721Mock.ownerOf(tokenId);
            expect(nftOwner, "Highest bidder should own the NFT").to.equal(bidder1.address);
        });

        it("should cancel an auction", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receipt = await tx.wait();
            const auctionId = receipt.logs[0].args.auctionId;

            const cancelTx = await nftAuctionManager.connect(owner).cancelAuction(auctionId);
            await cancelTx.wait();

            const auction = await nftAuctionManager.auctions(auctionId);
            // expect(auction.endedAt, "Ended at should be greater than 0").to.equal(0);
        });
        it("should return all auctions", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receipt = await tx.wait();
            const auctionId = receipt.logs[0].args.auctionId;
            const auctionDetails = await nftAuctionManager.getAuction(auctionId);

            const auctions = await nftAuctionManager.getAuctions();
            expect(auctions.length).to.equal(1);
            expect(auctions[0]).to.deep.equal(auctionDetails);
        });
    });

    describe("Bid Operations", function () {
        it("should place a bid", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receipt = await tx.wait();
            if (!receipt) throw new Error("No receipt");
            const auctionId = receipt.logs[0].args.auctionId;

            const bidValue = ethers.parseEther("1.5");
            const bidTx = await nftAuctionManager.connect(receiver1).placeBid(auctionId, bidValue, { value: bidValue });
            await bidTx.wait();

            const auction = await nftAuctionManager.auctions(auctionId);
            expect(auction.highestBidder).to.equal(receiver1.address);
            expect(auction.highestBid).to.equal(bidValue);
        });

        it("should withdraw a bid", async function () {
            // check the highest bidder should own the nft after the auction ends
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receipt = await tx.wait();
            if (!receipt) throw new Error("No receipt");
            const auctionId = receipt.logs[0].args.auctionId;

            const bidValue = ethers.parseEther("1.5");
            const bidTx = await nftAuctionManager.connect(receiver1).placeBid(auctionId, bidValue, { value: bidValue });
            await bidTx.wait();

            const withdrawTx = await nftAuctionManager.connect(receiver1).withdrawBid(auctionId);
            await withdrawTx.wait();

            const auction = await nftAuctionManager.auctions(auctionId);
            expect(auction.highestBidder).to.equal(ethers.ZeroAddress);
        });
    });
    describe("Special Operator", function () {
        it("should update the contract balance after a donation", async function () {
            const donateValue = ethers.parseEther("5.0");

            const tx = await nftAuctionManager.connect(owner).donate({ value: donateValue });
            await tx.wait();

            const contractBalance = await ethers.provider.getBalance(nftAuctionManager.target);
            const contractDonation = await nftAuctionManager.donation();
            expect(contractBalance).to.equal(donateValue);
            expect(contractDonation).to.equal(donateValue);

            const receipt = await tx.wait();
            const donors = await nftAuctionManager.donors(owner.address);
            expect(donors).to.equal(donateValue);
        });
    });
});