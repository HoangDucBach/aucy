import { ethers } from "hardhat";

module.exports = async () => {
    let wallet= (await ethers.getSigners())[0];

    const NFTAuctionManager = await ethers.getContractFactory("NFTAuctionManager", wallet);

    const nftAuctionManager = await NFTAuctionManager.deploy();

    const contractAddress=((await NFTAuctionManager.deploy()).waitForDeployment());

    console.log(`NFTAuctionManager deployed to: ${contractAddress}`);

    
}