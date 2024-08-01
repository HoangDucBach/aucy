// External Imports
import {
    TokenMintTransaction,
} from "@hashgraph/sdk";

// Internal Imports
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { HEDERA_PRIVATE_KEY } from "@/config/constants";
import { TMintTokenInfo, TNFTCollectionInfo } from "@/types";
import { validatePropsCreateNFTCollection, validatePropsMintNFT } from "@/lib/validator";

/**
 * Entry function: create nft using Hedera SDK
 * @param _mintTokenInfo
 * @param walletInterface
 */
export async function mintNFT(_mintTokenInfo: TMintTokenInfo, walletInterface: any) {
    // Validate props
    validatePropsMintNFT(_mintTokenInfo);

    const {
        tokenId,
        amount,
        metadata
    } = _mintTokenInfo;

    const tokenMintTransaction = new TokenMintTransaction()
        .setTokenId(_mintTokenInfo.tokenId)
        .setAmount(amount);

    if (metadata) tokenMintTransaction.setMetadata(metadata);

    // Sign transaction
    const signedTransaction = await tokenMintTransaction.freezeWithSigner(walletInterface.getSigner());

    // Submit transaction
    return await signedTransaction.executeWithSigner(walletInterface.getSigner());
}
