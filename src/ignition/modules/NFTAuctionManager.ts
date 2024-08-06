import { ethers } from "hardhat";

const main = async () => {
    const NFTAuctionManager = await ethers.getContractFactory("NFTAuctionManager");

    const nftAuctionManager = await NFTAuctionManager.deploy();

    await nftAuctionManager.waitForDeployment();

    console.log("NFTAuctionManager deployed to:", await nftAuctionManager.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// npx hardhat run ./ignition/modules/NFTAuctionManager.ts --network testnet