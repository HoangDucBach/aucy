import { expect } from "chai";
import hh from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("NFTAuction", function () {
  let NFTAuction: Contract;
  let nftAuction: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let nftContract: Contract;
  const tokenId = 1;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a mock ERC721 contract
    const MockERC721 = await ethers.getContractFactory("MockERC721");
    nftContract = await MockERC721.deploy();
    await nftContract.deployed();

    // Mint a token to owner
    await nftContract.mint(owner.address, tokenId);

    // Deploy the NFTAuction contract
    const NFTAuctionFactory = await ethers.getContractFactory("NFTAuction");
    nftAuction = await NFTAuctionFactory.deploy();
    await nftAuction.deployed();
  });

  it("Should create an auction", async function () {
    await nftContract.approve(nftAuction.address, tokenId);
    await nftAuction.createAuction(
      nftContract.address,
      tokenId,
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("2"),
      60 * 60 * 24, // 1 day
      owner.address,
      [],
      []
    );

    const auction = await nftAuction.nftContractAuctions(tokenId);
    expect(auction.seller).to.equal(owner.address);
  });

  it("Should place a bid", async function () {
    await nftContract.approve(nftAuction.address, tokenId);
    await nftAuction.createAuction(
      nftContract.address,
      tokenId,
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("2"),
      60 * 60 * 24, // 1 day
      owner.address,
      [],
      []
    );

    await nftAuction.connect(addr1).placeBid(tokenId, {
      value: ethers.utils.parseEther("1.5"),
    });

    const auction = await nftAuction.nftContractAuctions(tokenId);
    expect(auction.highestBid).to.equal(ethers.utils.parseEther("1.5"));
    expect(auction.highestBidder).to.equal(addr1.address);
  });

  // Add more tests as needed
});