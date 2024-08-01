// External Imports
import {
    TokenCreateTransaction,
    TokenSupplyType,
    TokenType,
    PrivateKey,
} from "@hashgraph/sdk";

// Internal Imports
import { HEDERA_PRIVATE_KEY } from "@/config/constants";
import { TNFTCollectionInfo } from "@/types";
import { validatePropsCreateNFTCollection } from "@/lib/validator";

/**
 * Entry function: create nft using Hedera SDK
 * @param _tokenInfo
 * @param walletInterface
 */
export async function createNFTCollection(_tokenInfo: TNFTCollectionInfo, walletInterface: any) {
    // Validate props
    validatePropsCreateNFTCollection(_tokenInfo);

    if (!HEDERA_PRIVATE_KEY) throw new Error('Supply key is required to create NFT');
    const operatorKey = PrivateKey.fromStringECDSA(HEDERA_PRIVATE_KEY);
    const {
        name,
        symbol,
        decimals,
        adminKey,
        kycKey,
        freezeKey,
        supplyKey,
        customFees,
        maxSupply,
        treasuryAccountId
    } = _tokenInfo;

    const tokenCreateTransaction = new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Infinite)
        .setSupplyKey(operatorKey);

    // Set keys
    if (adminKey) tokenCreateTransaction.setAdminKey(adminKey);
    if (supplyKey) tokenCreateTransaction.setSupplyKey(supplyKey);
    if (kycKey) tokenCreateTransaction.setKycKey(kycKey);
    if (freezeKey) tokenCreateTransaction.setFreezeKey(freezeKey);
    if (treasuryAccountId) tokenCreateTransaction.setTreasuryAccountId(treasuryAccountId);

    // Set more details
    if (decimals) tokenCreateTransaction.setDecimals(decimals);
    if (maxSupply) {
        tokenCreateTransaction
            .setSupplyType(TokenSupplyType.Finite)
            .setMaxSupply(maxSupply);
    }
    if (customFees) tokenCreateTransaction.setCustomFees(customFees);

    // Freeze the transaction
    await tokenCreateTransaction.freezeWithSigner(walletInterface.getSigner());

    // Submit transaction
    return await tokenCreateTransaction.executeWithSigner(walletInterface.getSigner());
}