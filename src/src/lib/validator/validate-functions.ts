// External Imports
import * as validator from 'validator';

// Internal Imports
import { TMintTokenInfo, TCollectionInfo, TCreateCollection } from '@/types';
import { ValidateError, ValidateErrorFactory, ValidateErrorType } from './validate-error';

/**
 * Validate props for create NFT collection
 * @param props TNFTCollectionInfo - extended TokenInfo
 * @returns boolean
 */
export const validatePropsCreateNFTCollection = (props: TCreateCollection) => {
    if (!props) return false;
    const {
        name,
        symbol,
        decimals,
        adminKey,
        kycKey,
        supplyKey,
        maxSupply,
        customFees
    } = props;
    if (!name || !symbol) {
        throw new ValidateError('Please fill in all required fields.');
    }
    // Validate keys
    if (adminKey && !validator.isEthereumAddress(adminKey)) {
        throw ValidateErrorFactory.createError(ValidateErrorType.CreateNFTsCollection, 'Invalid admin key');
    }
    if (kycKey && !validator.isEthereumAddress(kycKey)) {
        throw ValidateErrorFactory.createError(ValidateErrorType.CreateNFTsCollection, 'Invalid kyc key');
    }
    if (supplyKey && !validator.isEthereumAddress(supplyKey)) {
        throw ValidateErrorFactory.createError(ValidateErrorType.CreateNFTsCollection, 'Invalid supply key');
    }

    // Validate name
    if (!validator.isLength(name, { min: 1, max: 100 })) {
        throw ValidateErrorFactory.createError(ValidateErrorType.CreateNFTsCollection, 'Invalid name, name should be between 1 and 100 characters');
    }

    // Validate symbol
    if (!validator.isLength(symbol, { min: 1, max: 10 })) {
        throw ValidateErrorFactory.createError(ValidateErrorType.CreateNFTsCollection, 'Invalid symbol, symbol should be between 1 and 10 characters');
    }


    // Validate max supply
    if (maxSupply && maxSupply < 0) {
        throw ValidateErrorFactory.createError(ValidateErrorType.CreateNFTsCollection, 'Invalid max supply, max supply should be greater than 0');
    }

    return true;
}

/**
 * Validate props for mint NFT
 * @param props TMintTokenInfo - extended TokenInfo
 * @returns boolean
 */
export const validatePropsMintNFT = (props: TMintTokenInfo) => {
    const {
        tokenId,
        amount,
        metadata
    } = props;
    
    if (!tokenId || !amount) {
        throw new ValidateError('Please fill in all fields.');
    }

    // Validate tokenId
    if (!validator.isEthereumAddress(tokenId)) {
        throw ValidateErrorFactory.createError(ValidateErrorType.MintNFT, 'Invalid token id');
    }

    // Validate amount
    if (amount < 0) {
        throw ValidateErrorFactory.createError(ValidateErrorType.MintNFT, 'Invalid amount, amount should be greater than 0');
    }

    // Validate metadata
    if (metadata && !metadata.length) {
        throw ValidateErrorFactory.createError(ValidateErrorType.MintNFT, 'Invalid metadata');
    }

    return true;
}
