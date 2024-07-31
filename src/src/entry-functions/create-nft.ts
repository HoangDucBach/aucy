// External Imports
import {
    TokenCreateTransaction,
    TokenInfo,
    TokenSupplyType,
    TokenType,
    Key,
    PrivateKey,
    AccountId, PublicKey
} from "@hashgraph/sdk";

// Internal Imports
import {useWalletInterface} from "@/services/wallets/useWalletInterface";
import {HEDERA_PRIVATE_KEY} from "@/config/constants";

/**
 * Entry function: create nft using Hedera SDK
 * @param _tokenInfo
 * @param walletInterface
 * @param accountId
 */
export async function createNFT(_tokenInfo: TokenInfo, walletInterface: any, accountId: string) {
    if(!HEDERA_PRIVATE_KEY) throw new Error('Supply key is required to create NFT');
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
    } = _tokenInfo;

    const tokenCreateTransaction = new TokenCreateTransaction()
        // Token details
        .setTokenName(name)
        .setTokenSymbol(symbol)
        // Set token type
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Infinite)
        .setDecimals(0)
        .setInitialSupply(0)
        // Set keys
        .setTreasuryAccountId(accountId)
        .setSupplyKey(operatorKey);

    // if (adminKey) tokenCreateTransaction.setAdminKey(adminKey);
    // if (supplyKey) tokenCreateTransaction.setSupplyKey(supplyKey);
    // if (kycKey) tokenCreateTransaction.setKycKey(kycKey);
    // if (customFees) tokenCreateTransaction.setCustomFees(customFees);
    // if (freezeKey) tokenCreateTransaction.setFreezeKey(freezeKey);

    // Freeze the transaction
    await tokenCreateTransaction.freezeWithSigner(walletInterface.getSigner());

    // Submit transaction
    return await tokenCreateTransaction.executeWithSigner(walletInterface.getSigner());

}