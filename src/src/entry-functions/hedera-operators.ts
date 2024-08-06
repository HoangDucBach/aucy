// External imports
import axios, { AxiosError, AxiosResponse } from "axios";
import { PublicKey, TokenCreateTransaction, TokenId, TokenInfo, TokenMintTransaction, TokenSupplyType, TokenType } from "@hashgraph/sdk";

// Internal imports
import { appConfig } from "@/config";
import { TQuery, AccountError, AccountErrorType, InternalError, TMintTokenInfo, TCreateCollection } from "@/types";
import { keysToCamelCase } from "@/lib/helpers";
import pinataSdk from "@/utils/pinataSdk";
import { HEDERA_PRIVATE_KEY } from "@/config/constants";
import { validatePropsCreateNFTCollection } from "@/lib/validator";
import { WalletConnectWallet } from "@/services/wallets/walletconnect/walletConnectClient";
import { getPublicKey } from "@/utils/keyHelpers";

/**
 * Get my collections
 * @param accountId - Hedera account ID or evm address
 * @param query - query params
 * @returns - AccountInfo
 */
export async function getMyCollections(accountId: string, query?: TQuery): Promise<any[]> {
    if (!accountId) {
        throw new AccountError(AccountErrorType.ACCOUNT_NOT_CONNECTED);
    };
    try {
        const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/accounts/${accountId}/tokens`;
        const response = await axios.get(endpoint, {
            params: {
                ...query
            },
        });
        return keysToCamelCase(response.data.tokens);
    } catch (error: any) {
        if (error instanceof AxiosError) {
            throw error;
        }
        throw new InternalError(error.message);
    }

}


/**
 * Get NFTs
 */
export async function getNfts(tokenAddress: string, query?: TQuery): Promise<any[]> {
    try {
        if (!tokenAddress) throw new Error('Token address is required');
        const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/tokens/${tokenAddress}/nfts?order=asc`;
        const res = await axios.get(endpoint, {
            params: {
                ...query
            }
        });
        return keysToCamelCase(res.data.nfts);
    } catch (error: any) {
        throw new Error(error);
    };
}
/*
|| INFO FUNCTIONS
*/
/**
 * Get token info
 * @param tokenId - Hedera token ID
 * @param query
 */
export async function getNftInfo(tokenId: string, serial: any, query?: TQuery): Promise<TokenInfo> {
    if (!tokenId) throw new Error('Token ID is required to get NFT info');
    console.log('Token ID:', TokenId.fromSolidityAddress(tokenId).toString());
    try {
        const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/tokens/${TokenId.fromSolidityAddress(tokenId).toString()}/nfts/${serial}`;

        const res = await axios.get(endpoint, {
            params: {
                ...query
            },
        });
        return keysToCamelCase(res.data);
    } catch (error: any) {
        if (error instanceof AxiosError) {
            throw error;
        }
        throw new InternalError(error.message);
    }
}

/**
 * Get token info
 * @param tokenId - Hedera token ID
 * @param query
 */
export async function getTokenInfo(tokenId: string, query?: TQuery): Promise<TokenInfo> {
    if (!tokenId) throw new Error('Account ID is required to get collections');
    try {
        const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/tokens/${tokenId}`;

        const res = await axios.get(endpoint, {
            params: {
                ...query
            },
        });
        return keysToCamelCase(res.data);
    } catch (error: any) {
        if (error instanceof AxiosError) {
            throw error;
        }
        throw new InternalError(error.message);
    }
}

/**
 * Get account info
 * @param accountId - Hedera account ID or evm address
 * @param query - query params
 */
export async function getAccountInfo(accountId: string, query?: TQuery) {
    if (!accountId) throw new Error('Account ID is required to get collections');
    try {
        const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/accounts/${accountId}`;

        return await axios.get(endpoint, {
            params: {
                ...query
            },
        });
    } catch (error: any) {
        if (error instanceof AxiosError) {
            throw error;
        }
        throw new InternalError(error.message);
    }
}
/**
 * || NFT FUNCTIONS
 */

/**
 * Entry function: create nft using Hedera SDK
 * @param _tokenInfo
 * @param walletInterface
 */
export async function createCollection(_tokenInfo: TCreateCollection, walletInterface: WalletConnectWallet) {
    if (!HEDERA_PRIVATE_KEY) throw new Error('Supply key is required to create NFT');

    // Validate props
    validatePropsCreateNFTCollection(_tokenInfo);

    try {

        const operatorKey = getPublicKey(walletInterface.getSigner().getAccountId());
        if(!operatorKey) throw new Error('Failed to get your public key');

        const {
            name,
            symbol,
            decimals,
            adminKey,
            kycKey,
            supplyKey,
            customFees,
            maxSupply,
            treasuryAccountId
        } = _tokenInfo;

        const tokenCreateTransaction = new TokenCreateTransaction()
            .setTokenName(name!)
            .setTokenSymbol(symbol)
            .setTokenType(TokenType.NonFungibleUnique)
            .setSupplyType(TokenSupplyType.Infinite)
            .setInitialSupply(0)
            .setTreasuryAccountId(walletInterface.getSigner().getAccountId())
            // Set random supply key
            .setAdminKey(operatorKey)
            .setSupplyKey(operatorKey)

        // Set keys
        if (adminKey) tokenCreateTransaction.setAdminKey(PublicKey.fromStringED25519(adminKey) || PublicKey.fromStringECDSA(adminKey));
        if (supplyKey) tokenCreateTransaction.setSupplyKey(PublicKey.fromStringED25519(supplyKey) || PublicKey.fromStringECDSA(supplyKey));
        if (kycKey) tokenCreateTransaction.setKycKey(PublicKey.fromStringED25519(kycKey) || PublicKey.fromStringECDSA(kycKey));

        // Freeze the transaction
        await tokenCreateTransaction.freezeWithSigner(walletInterface.getSigner());
        // Submit transaction
        return await tokenCreateTransaction.executeWithSigner(walletInterface.getSigner());
    }
    catch (error: any) {
        console.error(error);
        throw new Error('Failed to create collection');
    }
}

/**
 * Mint NFT
 * @param _mintTokenInfo
 * @param walletInterface
 * @param metadataFilePath - Path to the metadata file
 */
export async function mintNFT(_mintTokenInfo: TMintTokenInfo, walletInterface: any, metadata: any) {
    try {
        // validatePropsMintNFT(_mintTokenInfo);
        const {
            tokenId,
        } = _mintTokenInfo;

        if (!tokenId) throw new Error('Token ID is required to mint NFT');
        // Pin metadata to IPFS
        const pinataResponse = await pinataSdk.pinJSONToIPFS(metadata);
        const metadataUri = pinataResponse.IpfsHash;

        const tokenMintTransaction = new TokenMintTransaction()
            .setTokenId(tokenId)
            .setMetadata([Buffer.from(metadataUri)]);

        // Sign transaction
        const signedTransaction = await tokenMintTransaction.freezeWithSigner(walletInterface.getSigner());

        // Submit transaction
        return await signedTransaction.executeWithSigner(walletInterface.getSigner());
    } catch (error: any) {
        throw new Error("Error minting NFT");
    }
}