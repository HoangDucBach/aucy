import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  import { getAddress, parseGwei } from "viem";
  
  describe("NFTAuctionManager", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployNFTAuctionManagerFixture() {
      const [owner, bidder1, bidder2] = await hre.viem.getWalletClients();
  
      const nftAuctionManager = await hre.viem.deployContract("NFTAuctionManager", []);
  
      const publicClient = await hre.viem.getPublicClient();
  
      return {
        nftAuctionManager,
        owner,
        bidder1,
        bidder2,
        publicClient,
      };
    }
  
    describe("Deployment", function () {
      it("Should set the right owner", async function () {
        const { nftAuctionManager, owner} = await loadFixture(deployNFTAuctionManagerFixture);
  
        expect(await nftAuctionManager.read.owner()).to.equal(
          getAddress(owner.account.address)
        );
      });
    });
  
    describe("Auction Management", function () {
      it("Should create an auction", async function () {
        const { nftAuctionManager, owner } = await loadFixture(deployNFTAuctionManagerFixture);
  

        const tokenId = 1;
        const startingPrice = parseGwei("1");
        const endingPrice = parseGwei("0.1");
        const bidPeriod = 60 * 60; // 1 hour
        const duration = 24 * 60 * 60; // 1 day
      });
    });
    // describe("Auction Management", function () {
    //   it("Should create an auction", async function () {
    //     const { nftAuctionManager, owner } = await loadFixture(deployNFTAuctionManagerFixture);
  
    //     const auctionId = await nftAuctionManager.write.createAuction("NFT1", parseGwei("1"));
  
    //     expect(await nftAuctionManager.read.getAuction(auctionId)).to.exist;
    //   });
  
    //   it("Should place a bid", async function () {
    //     const { nftAuctionManager, bidder1 } = await loadFixture(deployNFTAuctionManagerFixture);
  
    //     const auctionId = await nftAuctionManager.write.createAuction("NFT1", parseGwei("1"));
  
    //     await nftAuctionManager.write.placeBid(auctionId, {
    //       from: bidder1.account.address,
    //       value: parseGwei("2"),
    //     });
  
    //     const highestBid = await nftAuctionManager.read.getHighestBid(auctionId);
    //     expect(highestBid.amount).to.equal(parseGwei("2"));
    //     expect(highestBid.bidder).to.equal(getAddress(bidder1.account.address));
    //   });
  
    //   it("Should finalize an auction", async function () {
    //     const { nftAuctionManager, owner, bidder1 } = await loadFixture(deployNFTAuctionManagerFixture);
  
    //     const auctionId = await nftAuctionManager.write.createAuction("NFT1", parseGwei("1"), {
    //       from: owner.account.address,
    //     });
  
    //     await nftAuctionManager.write.placeBid(auctionId, {
    //       from: bidder1.account.address,
    //       value: parseGwei("2"),
    //     });
  
    //     await time.increase(60 * 60 * 24 * 7); // Increase time by 7 days
  
    //     await nftAuctionManager.write.finalizeAuction(auctionId, {
    //       from: owner.account.address,
    //     });
  
    //     const auction = await nftAuctionManager.read.getAuction(auctionId);
    //     expect(auction.finalized).to.be.true;
    //   });
    // });
  
    // describe("Events", function () {
    //   it("Should emit an event on auction creation", async function () {
    //     const { nftAuctionManager, owner } = await loadFixture(deployNFTAuctionManagerFixture);
  
    //     const tx = await nftAuctionManager.write.createAuction("NFT1", parseGwei("1"), {
    //       from: owner.account.address,
    //     });
  
    //     const receipt = await tx.wait();
    //     const event = receipt.events.find(e => e.event === "AuctionCreated");
  
    //     expect(event).to.exist;
    //     expect(event.args.nft).to.equal("NFT1");
    //     expect(event.args.startingBid).to.equal(parseGwei("1"));
    //   });
  
    //   it("Should emit an event on bid placement", async function () {
    //     const { nftAuctionManager, bidder1 } = await loadFixture(deployNFTAuctionManagerFixture);
  
    //     const auctionId = await nftAuctionManager.write.createAuction("NFT1", parseGwei("1"));
  
    //     const tx = await nftAuctionManager.write.placeBid(auctionId, {
    //       from: bidder1.account.address,
    //       value: parseGwei("2"),
    //     });
  
    //     const receipt = await tx.wait();
    //     const event = receipt.events.find(e => e.event === "BidPlaced");
  
    //     expect(event).to.exist;
    //     expect(event.args.auctionId).to.equal(auctionId);
    //     expect(event.args.bidder).to.equal(getAddress(bidder1.account.address));
    //     expect(event.args.amount).to.equal(parseGwei("2"));
    //   });
  
    //   it("Should emit an event on auction finalization", async function () {
    //     const { nftAuctionManager, owner, bidder1 } = await loadFixture(deployNFTAuctionManagerFixture);
  
    //     const auctionId = await nftAuctionManager.write.createAuction("NFT1", parseGwei("1"), {
    //       from: owner.account.address,
    //     });
  
    //     await nftAuctionManager.write.placeBid(auctionId, {
    //       from: bidder1.account.address,
    //       value: parseGwei("2"),
    //     });
  
    //     await time.increase(60 * 60 * 24 * 7); // Increase time by 7 days
  
    //     const tx = await nftAuctionManager.write.finalizeAuction(auctionId, {
    //       from: owner.account.address,
    //     });
  
    //     const receipt = await tx.wait();
    //     const event = receipt.events.find(e => e.event === "AuctionFinalized");
  
    //     expect(event).to.exist;
    //     expect(event.args.auctionId).to.equal(auctionId);
    //   });
    // });
  });