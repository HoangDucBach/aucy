// External imports
import axios, { AxiosError, AxiosResponse } from "axios";
import { AccountId, AccountInfoQuery, PublicKey, Signer, TokenCreateTransaction, TokenId, TokenInfo, TokenMintTransaction, TokenSupplyType, TokenType, TopicCreateTransaction, TopicId, TopicInfoQuery, TopicMessage, TopicMessageQuery, TopicMessageSubmitTransaction } from "@hashgraph/sdk";

// Internal imports
import { appConfig } from "@/config";
import { TQuery, AccountError, AccountErrorType, InternalError, TMintTokenInfo, TCreateCollection, TCollectionInfo, SubmitMessageError, SubmitMessageErrorType, TTopicMessage } from "@/types";
import { keysToCamelCase } from "@/lib/helpers";
import pinataSdk from "@/utils/pinataSdk";
import { HEDERA_PRIVATE_KEY } from "@/config/constants";
import { validatePropsCreateNFTCollection } from "@/lib/validator";
import { WalletConnectWallet } from "@/services/wallets/walletconnect/walletConnectClient";
import { getPublicKey } from "@/utils/keyHelpers";
import client from "@/utils/hederaClient";
import { getMetadata } from "./ipfs-operators";
import { WalletInterface } from "@/services/helpers/walletInterfaces";

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

export async function getMyNfts(accountId: string, tokenId: string, query?: TQuery): Promise<any[]> {
    if (!accountId) throw new AccountError(AccountErrorType.ACCOUNT_NOT_CONNECTED);
    try {
        const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/tokens/${tokenId}/nfts`;
        const accountHedera= await new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(client);

        const res = await axios.get(endpoint, {
            params: {
                ...query,
                'account.id': accountHedera.accountId,
                'order': 'asc'
            }
        });
        return keysToCamelCase(res.data.nfts);
    } catch (error: any) {
        throw new InternalError(error.message);
    }
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
    try {
        let address1, address2, address3, endpoint;

        try {
            address1 = TokenId.fromSolidityAddress(tokenId).toString();
        } catch (error) {
        }

        try {
            address2 = TokenId.fromString(tokenId).toString();
        } catch (error) {
        }

        try {
            address3 = TokenId.fromBytes(Buffer.from(tokenId)).toString();
        } catch (error) {
        }

        try {
            endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/tokens/${TokenId.fromSolidityAddress(tokenId).toString()}/nfts/${serial}`;
        } catch (error) {
        }

        const res = await axios.get(endpoint!, {
            params: {
                ...query
            },
        });
        return keysToCamelCase(res.data);
    } catch (error: any) {
        throw new InternalError(error.message);
    }
}

export async function getCollections(query?: TQuery): Promise<TCollectionInfo[]> {
    try {
        const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/tokens`;
        const res = await axios.get(endpoint, {
            params: {
                type: TokenType.NonFungibleUnique,
                ...query
            }
        });
        const data = res.data.tokens;
        const collections: TCollectionInfo[] = [];
        for (let i = 0; i < data.length; i++) {
            const collection = keysToCamelCase<TCollectionInfo>(data[i]);
            collections.push(collection);
        }
        return collections;
    } catch (error: any) {
        return [];
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
export async function createCollection(_tokenInfo: TCreateCollection, walletInterface: WalletInterface) {
    if (!HEDERA_PRIVATE_KEY) throw new Error('Supply key is required to create NFT');

    // Validate props
    validatePropsCreateNFTCollection(_tokenInfo);

    try {

        const operatorKey = await getPublicKey(walletInterface.getSigner().getAccountId());
        console.log('operatorKey', operatorKey);
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
export async function mintNFT(_mintTokenInfo: TMintTokenInfo, walletInterface: WalletInterface, metadata: any) {
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


        // Submit message to topic
        await submitAMessage(appConfig.constants.AUCY_TOPIC_ID, `New NFT minted: ${metadataUri}`, walletInterface);

        // Submit transaction
        return await signedTransaction.executeWithSigner(walletInterface.getSigner());
    } catch (error: any) {
        console.error(error);
        throw new Error("Error minting NFT");
    }
}

/*
|| TOPICS FUNCTIONS
*/

/**
 * Create topics
 */
export async function createTopic(walletInterface: WalletInterface) {
    if (!walletInterface) throw new AccountError(AccountErrorType.ACCOUNT_NOT_CONNECTED);
    try {
        const operatorKey = await walletInterface.getPublicKey();
        const topicCreateTransaction = new TopicCreateTransaction()
        if (operatorKey) topicCreateTransaction.setAdminKey(operatorKey);

        const txResponse = await topicCreateTransaction.execute(client);
        const receipt = await txResponse.getReceipt(client);
        return receipt.topicId;
    } catch (error: any) {
        throw new Error("Error creating topic");
    }
}
export async function subcribeTopic(topicId: string) {
    try {
        new TopicMessageQuery()
            .setTopicId(topicId)
            .subscribe(client, null, (message) => {
            });
    } catch (error: any) {
        throw new Error("Error subscribing to topic");
    }
}
/**
 * Submit message to topic
 * @param topicId
 * @param message
 * @param walletInterface
 * @returns boolean
 */
export async function submitAMessage(topicId: string, message: string, walletInterface: WalletInterface) {
    if (!walletInterface) throw new AccountError(AccountErrorType.ACCOUNT_NOT_CONNECTED);

    try {
        const transaction = new TopicMessageSubmitTransaction()
            .setTopicId(topicId)
            .setMessage(message)
        const txResponse = await transaction.execute(client);
        console.log('txResponse', txResponse);
        // const receipt = await txResponse.getReceiptWithSigner(signer);

        // return receipt.status;
    } catch (error: any) {
        console.error(error);
        throw new SubmitMessageError(SubmitMessageErrorType.SUBMIT_MESSAGE_FAILED);
    }
}

/**
 * Get topic info
 * @param topicId
 */
export async function getTopicInfo(topicId: string, walletInterface: WalletConnectWallet) {
    if (!topicId) throw new Error('Topic ID is required to get topic info');

    try {
        const query = new TopicInfoQuery()
            .setTopicId(topicId);

        const info = await query.executeWithSigner(walletInterface.getSigner());
        return info;
    } catch (error: any) {
        throw new Error('Failed to get topic info');
    }
}

/**
 * Get topic messages
 * @param topicId
 * @returns string[]
 */
export async function getTopicMessages(topicId: string) {
    if (!topicId) throw new Error('Topic ID is required to get topic messages');
    const messages: TTopicMessage[] = []
    try {
        const res = await axios.get(`${appConfig.constants.HEDERA_API_ENDPOINT}/topics/${topicId}/messages`)
        const data = res.data.messages;
        for (let i = 0; i < data.length; i++) {
            const decodedMessage = Buffer.from(data[i].message, 'base64').toString();
            const message: TTopicMessage = {
                message: decodedMessage,
                accountId: data[i].payer_account_id,
                topicId: data[i].topic_id,
                timestamp: data[i].consensus_timestamp,
            }
            messages.push(message);
        }
        return messages;
    } catch (error: any) {
        console.error('Error getting topic messages', error);
        throw new Error('Failed to get topic messages');
    }
}