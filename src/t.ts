// External imports
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-ethers";
import envConfig from "dotenv";

// Internal imports
import "./tasks/nftAuctionManger/deploy";

envConfig.config({
  path: ".env.development",
})

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
      {
        version: "0.8.19",
      },
    ],
  },
  defaultNetwork: "testnet",
  networks: {
    hardhat: {
    },
    testnet: {
      url: process.env.NEXT_PUBLIC_TESTNET_ENDPOINT,
      accounts: [process.env.NEXT_PUBLIC_TESTNET_OPERATOR_PRIVATE_KEY as string],
    },
  }
};

// task("nftAuctionManager-deploy", async () => {
//   const deployContract = require("./scripts/deploy/NFTManager").default;
//   return deployContract();
// });


export default config;
