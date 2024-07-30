import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTAuctionManagerModule = buildModule("NFTAuctionManager", (m) => {
  const NFTAuctionManager = m.contract("NFTAuctionManager", []);
  return { NFTAuctionManager };
});
export default NFTAuctionManagerModule;
