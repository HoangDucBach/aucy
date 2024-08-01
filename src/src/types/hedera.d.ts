import { TokenInfo } from "@hashgraph/sdk"
/**
 * Type: TNFTCollectionInfo
 * Description: Extended TokenInfo for NFT Collection
 * @extends TokenInfo
 */
export type TNFTCollectionInfo = TokenInfo & {
    adminKey?: string;
    kycKey?: string;
    freezeKey?: string;
    supplyKey?: string;
    customFees?: string;
    maxSupply?: string;
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

