// External imports
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import envConfig from "dotenv-flow";

// Internal imports
import "./tasks/nftAuctionManger/deploy";

// configure dotenv-flow
envConfig.config({node_env: "test"});

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
      url: process.env.TESTNET_ENDPOINT,
      accounts: [process.env.TESTNET_OPERATOR_PRIVATE_KEY as string],
    },
  }
};

// task("nftAuctionManager-deploy", async () => {
//   const deployContract = require("./scripts/deploy/NFTManager").default;
//   return deployContract();
// });


export default config;
