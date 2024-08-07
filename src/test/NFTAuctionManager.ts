import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { NFTAuctionManager, ERC721Mock } from "../typechain-types";


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
    let topicId: string;
    let startingPrice: any;
    let minBidIncrement: any;
    let endingPrice: any;
    let endingAt: any;
    let donation: any;
    let receivers: string[];
    let percentages: number[];

    beforeEach(async function () {
        ({ erc721Mock, nftAuctionManager } = await loadFixture(deployContractFixture));

        // Get the signers
        [owner, receiver1, receiver2, bidder1, bidder2] = await ethers.getSigners();

        // Mock the auction details
        auctionName = "Test Auction";
        auctionDescription = "This is a test auction";
        tokenAddress = await erc721Mock.getAddress();
        tokenId = 1;
        topicId = tokenAddress;
        startingPrice = ethers.parseEther("1.0");
        minBidIncrement = ethers.parseEther("0.1");
        endingPrice = ethers.parseEther("5.0");
        endingAt = new Date().getTime() + 60; // 60 seconds
        donation = ethers.parseEther("0.0");
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
                topicId,
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

            expect(auction.id, "Auction ID does not match").to.equal(auctionId);
            expect(auction.name, "Name does not match").to.equal(auctionName);
            expect(auction.description, "Description does not match").to.equal(auctionDescription);
            expect(auction.tokenId, "Token ID does not match").to.equal(tokenId);
            expect(auction.tokenAddress, "Token address does not match").to.equal(tokenAddress);
            expect(auction.topicId, "Topic ID does not match").to.equal(topicId);
            expect(auction.seller, "Seller does not match").to.equal(owner.address);
            expect(auction.startingPrice, "Starting price does not match").to.equal(startingPrice);
            expect(auction.minBidIncrement, "Minimum bid increment does not match").to.equal(minBidIncrement);
            expect(auction.endingPrice, "Ending price does not match").to.equal(endingPrice);
            expect(auction.startedAt, "Started at does not match").to.be.above(0);
            expect(auction.endingAt, "Ending at does not match").to.equal(endingAt);
            expect(auction.donation, "Donation does not match").to.equal(donation);
            expect(await nftAuctionManager.getReceivers(auctionId), "Receivers does not match").to.deep.equal(receivers);
            expect(await nftAuctionManager.getPercentages(auctionId), "Percentages does not match").to.deep.equal(percentages);


            expect({ ...auctionDetails }).to.deep.equal({ ...auction });

            expect(receipt.logs[0].fragment.name, "Event name does not match").to.equal("AuctionCreated");
        });

        it("should end an auction", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                topicId,
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
            const bidTx = await nftAuctionManager.connect(bidder1).placeBid(auctionId, { value: bidValue });
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
                topicId,
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
                topicId,
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
            expect(auctions.length, "Length of auctions not match").to.equal(1);
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
                topicId,
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
            const bidTx = await nftAuctionManager.connect(receiver1).placeBid(auctionId, { value: bidValue });
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
                topicId,
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
            const bidTx = await nftAuctionManager.connect(receiver1).placeBid(auctionId, { value: bidValue });
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
            const txAuction = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                topicId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receiptAuction = await txAuction.wait();
            if (!receiptAuction) throw new Error("No receipt");
            const auctionId = receiptAuction.logs[0].args.auctionId;
            const initialContractBalance = await ethers.provider.getBalance(nftAuctionManager.target);
            const tx = await nftAuctionManager.connect(owner).donate(auctionId, { value: donateValue });
            await tx.wait();

            const afterContractBalance = await ethers.provider.getBalance(nftAuctionManager.target);
            const contractDonation = afterContractBalance - initialContractBalance;
            expect(contractDonation, "Contract balance should be updated").to.equal(donateValue);
        });
    });
    describe("Additional Tests", function () {
        it("should not allow non-owner to create an auction", async function () {
            await expect(
                nftAuctionManager.connect(bidder1).createAuction(
                    auctionName,
                    auctionDescription,
                    tokenAddress,
                    tokenId,
                    topicId,
                    startingPrice,
                    minBidIncrement,
                    endingPrice,
                    endingAt,
                    receivers,
                    percentages
                )
            ).to.be.revertedWith("Only NFT owner can create an auction");
        });

        it("should not allow non-owner to end an auction", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                topicId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receipt = await tx.wait();
            const auctionId = receipt.logs[0].args.auctionId;

            await expect(
                nftAuctionManager.connect(bidder1).endAuction(auctionId)
            ).to.be.revertedWith("Only auction owner can perform this action");
        });

        it("should not allow bid lower than starting price or increment", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                topicId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receipt = await tx.wait();
            const auctionId = receipt.logs[0].args.auctionId;

            const lowBidValue = ethers.parseEther("0.5");
            await expect(
                nftAuctionManager.connect(bidder1).placeBid(auctionId, { value: lowBidValue })
            ).to.be.revertedWith("Bid amount is not greater than the starting price");

            const validBidValue = ethers.parseEther("1.0");
            await nftAuctionManager.connect(bidder1).placeBid(auctionId, { value: validBidValue });

            const lowerIncrementBidValue = ethers.parseEther("1.05");
            await expect(
                nftAuctionManager.connect(bidder2).placeBid(auctionId, { value: lowerIncrementBidValue })
            ).to.be.revertedWith("Bid amount is not greater than the min bid increment");
        });
        
        it("should not allow non-owner to cancel an auction", async function () {
            const tx = await nftAuctionManager.connect(owner).createAuction(
                auctionName,
                auctionDescription,
                tokenAddress,
                tokenId,
                topicId,
                startingPrice,
                minBidIncrement,
                endingPrice,
                endingAt,
                receivers,
                percentages
            );
            const receipt = await tx.wait();
            const auctionId = receipt.logs[0].args.auctionId;

            await expect(
                nftAuctionManager.connect(bidder1).cancelAuction(auctionId)
            ).to.be.revertedWith("Only auction owner can perform this action");
        });
    });
});
