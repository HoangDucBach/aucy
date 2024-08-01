import { ethers } from "hardhat";

const main = async () => {
    const NFTAuctionManager = await ethers.getContractFactory("NFTAuctionManager");

    const nftAuctionManager = await NFTAuctionManager.deploy();

    await nftAuctionManager.deployed();

    console.log("NFTAuctionManager deployed to:", nftAuctionManager.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// npx hardhat run ./ignition/modules/NFTAuctionManager.ts --network testnet