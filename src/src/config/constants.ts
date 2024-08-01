// External imports

// Metadata of dapp
export const METADATA = {
  name: "Aucy",
  description: "Aucy - NFT Auction Marketplace",
  url: '',
};


// Hedera Account
export const HEDERA_ACCOUNT_ID = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID;
export const HEDERA_PRIVATE_KEY = process.env.NEXT_PUBLIC_HEDERA_DER_PRIVATE_KEY;

// MetaMask constants
export const METAMASK_GAS_LIMIT_ASSOCIATE = 800_000;
export const METAMASK_GAS_LIMIT_TRANSFER_FT = 50_000;
export const METAMASK_GAS_LIMIT_TRANSFER_NFT = 100_000;

// HashPack constants
export const HASHPACK_GAS_LIMIT_ASSOCIATE = 800_000;
export const HASHPACK_GAS_LIMIT_TRANSFER_FT = 50_000;
export const HASHPACK_GAS_LIMIT_TRANSFER_NFT = 100_000;

// Hedera API constants
export const HEDERA_API_ENDPOINT = process.env.NEXT_PUBLIC_HEDERA_API_ENDPOINT;
export const HEDERA_NETWORK = process.env.NEXT_PUBLIC_HEDERA_NETWORK;

// Aucy constants
export const AUCY_CONTRACT_NFT_AUCTION_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_AUCY_CONTRACT_NFT_AUCTION_MANAGER_ADDRESS as string;
export const AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID = process.env.NEXT_PUBLIC_AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID as string;