import { Long, TokenId, TokenInfo } from "@hashgraph/sdk"
/**
 * Type: TNFTCollectionInfo
 * Description: Extended TokenInfo for NFT Collection
 * @extends TokenInfo
 */
export type TCollectionInfo = TokenInfo & {
    adminKey?: string;
    kycKey?: string;
    freezeKey?: string;
    supplyKey?: string;
    customFees?: string;
    maxSupply?: string;
}

/**
 * Type: TCreateCollection
 * Description: Create Collection
 * @param name - string
 * @param symbol - string
 * @param decimal - number
 * @param maxSupply - number
 * @param customFee - number
 * @param adminKey - string
 * @param supplyKey - string
 * @param kycKey - string
 */
export type TCreateCollection = {
    name?: string;
    symbol: string;
    decimals?: number;
    maxSupply?: number;
    customFees?: number;
    adminKey?: string;
    supplyKey?: string;
    kycKey?: string;
    treasuryAccountId?: string;
}
/**
 * Type: TMintTokenInfo
 * Description: Extended TokenInfo for Mint Token
 * @param tokenId - TokenId
 * @param amount - number | Long
 * @param metadata - Uint8Array[]
 */
export type TMintTokenInfo = {
    tokenId?: string | TokenId | undefined;
    amount?: number | Long.Long | undefined;
    metadata?: Uint8Array[] | undefined;
}

