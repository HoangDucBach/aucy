export class ValidateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidateError';
    }
}

export enum ValidateErrorType {
    CreateNFTsCollection,
    MintNFT
}

export class ValidateErrorFactory {
    static createError(type: ValidateErrorType, message: string): ValidateError {
        switch (type) {
            case ValidateErrorType.CreateNFTsCollection:
                return new ValidateError(`Create NFTs Collection: ${message}`);
            case ValidateErrorType.MintNFT:
                return new ValidateError(`Mint NFT: ${message}`);
            default:
                return new ValidateError(message);
        }
    }
}