import { task } from "hardhat/config";

task("nftAuctionManager-deploy", async () => {
    const deployContract = require("../../scripts/deploy/NFTAuctionManager").default;
    return deployContract();
});
