// External imports
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";

import envConfig from "dotenv";

// Internal imports

envConfig.config({
  path: ".env.development",
})

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
      },
      {
        version: "0.8.20",
      },
      {
        version: "0.8.19",
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    testnet: {
      chainId: 296,
      url: process.env.NEXT_PUBLIC_TESTNET_ENDPOINT,
      accounts: [process.env.NEXT_PUBLIC_TESTNET_OPERATOR_PRIVATE_KEY as string],
    },
  }
};


export default config;
