import { ethers } from "hardhat";
import { expect } from "chai";
import { } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

async function deployContractFixture() {
    // Deploy ERC721Mock contract
    const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    const erc721Mock = await ERC721Mock.deploy("MockNFT", "MNFT");
    await erc721Mock.deployed();

    // Deploy NFTAuctionManager contract
    const NFTAuctionManager = await ethers.getContractFactory("NFTAuctionManager");
    const nftAuctionManager = await NFTAuctionManager.deploy();
    await nftAuctionManager.deployed();

    return { erc721Mock, nftAuctionManager };
}

describe("NFTAuctionManager", function () {
    it("should create an auction", async function () {
        const { erc721Mock, nftAuctionManager } = await loadFixture(deployContractFixture);
        const [owner] = await ethers.getSigners();
        const tokenAddress = erc721Mock.address; // Use the address of the deployed ERC721Mock contract
        const startingPrice = ethers.utils.parseEther("1.0"); // 1 ETH
        const tokenId = 1;
        const endingPrice = ethers.utils.parseEther("2.0"); // 2 ETH
        const bidPeriod = 60; // 1 minute
        const duration = 60 * 60 * 24; // 1 day in seconds

        // Ensure the owner has the token
        await erc721Mock.connect(owner).transferFrom(owner.address, owner.address, tokenId);

        // Call the createAuction function
        const tx = await nftAuctionManager.connect(owner).createAuction(
            tokenAddress,
            tokenId,
            startingPrice,
            endingPrice,
            bidPeriod,
            duration
        );
        const receipt = await tx.wait();
        const auctionId = receipt.events[0].args.auctionId;

        // Check the auction details
        const auction = await nftAuctionManager.auctions(auctionId);

        console.log("Address: ", owner.address);
        console.log("Token Address: ", tokenAddress);
        expect(auction.startingPrice, "Starting price does not match").to.equal(startingPrice);
        expect(auction.tokenAddress, "Token address does not match").to.equal(tokenAddress);
    });

    describe("Special Operator", function () {
        it("should update the contract balance after a donation", async function () {
            const { nftAuctionManager } = await loadFixture(deployContractFixture);
            const [owner] = await ethers.getSigners();
            const donateValue = ethers.utils.parseEther("5.0"); // 5 ETH

            // Call the donate function
            const tx = await nftAuctionManager.connect(owner).donate({ value: donateValue });
            await tx.wait();

            // Check the contract balance
            const contractBalance = await ethers.provider.getBalance(nftAuctionManager.address);
            const contractDonation = await nftAuctionManager.donation();
            expect(contractBalance).to.equal(donateValue);
            expect(contractDonation).to.equal(donateValue);
        });
    });
});