
/*
|| IDENTITY ERROR
*/
export class IdentityError extends Error {
    constructor(type: IdentityErrorType, message?: string) {
        super(message || type);
        this.name = 'IdentityError';
        this.cause = type;
    }

    cause: IdentityErrorType;
}

export enum IdentityErrorType {
    IDENTITY_NOT_FOUND = 'Identity not found',
}

export enum IdentityErrorMessages {
    IDENTITY_NOT_FOUND = 'Identity not found',
}
/*
|| ACCOUNT ERROR
*/

/**
 * Custom error class for account errors
 * @class AccountError
 */
export class AccountError extends Error {
    constructor(type: AccountErrorType, message?: string) {
        super(message || type);
        this.name = 'AccountError';
        this.cause = type;
    }

    cause?: AccountErrorType;
}
/**
 * Account error types
 * @enum {string}
 */
export enum AccountErrorType {
    ACCOUNT_NOT_FOUND = 'Account not found',
    ACCOUNT_NOT_CONNECTED = 'Account not connected'
}

/**
 * Account error messages
 * @enum {string}
 */
export enum AccountErrorMessages {
    ACCOUNT_NOT_FOUND = 'Account not found',
    ACCOUNT_NOT_CONNECTED = 'Account not connected'
}
/*
|| AUCTION OPERATOR ERROR
*/
export class AuctionDonationError extends Error {
    constructor(type: AuctionDonationErrorType, message?: AuctionDonationErrorMessages | string) {
        super(message || type);
        this.name = 'AuctionDonationError';
        this.cause = type;
    }

    cause: AuctionDonationErrorType;
}

export enum AuctionDonationErrorType {
    AUCTION_NOT_FOUND = 'AUCTION_NOT_FOUND',
    DONATION_FAILED = 'DONATION_FAILED'
}

export enum AuctionDonationErrorMessages {
    AUCTION_NOT_FOUND = 'Auction not found!',
    DONATION_FAILED = 'Donation failed, please try again!'
}


export class AuctionPlaceBidError extends Error {
    constructor(type: AuctionPlaceBidErrorType, message?: AuctionPlaceBidErrorMessages | string) {
        super(message || type);
        this.name = 'AuctionPlaceBidError';
        this.cause = type;
    }

    cause: AuctionPlaceBidErrorType;
}

export enum AuctionPlaceBidErrorType {
    AUCTION_NOT_FOUND = 'AUCTION_NOT_FOUND',
    BID_FAILED = 'BID_FAILED'
}

export enum AuctionPlaceBidErrorMessages {
    AUCTION_NOT_FOUND = 'Auction not found!',
    BID_FAILED = 'Bid failed, please try again!'
}

export class AuctionWithdrawBidError extends Error {
    constructor(type: AuctionWithdrawBidErrorType, message?: AuctionWithdrawBidErrorMessages | string) {
        super(message || type);
        this.name = 'AuctionWithdrawBidError';
        this.cause = type;
    }

    cause: AuctionWithdrawBidErrorType;
}

export enum AuctionWithdrawBidErrorType {
    AUCTION_NOT_FOUND = 'AUCTION_NOT_FOUND',
    WITHDRAW_BID_FAILED = 'WITHDRAW_BID_FAILED'
}

export enum AuctionWithdrawBidErrorMessages {
    AUCTION_NOT_FOUND = 'Auction not found!',
    WITHDRAW_BID_FAILED = 'Withdraw bid failed, please try again!'
}

export class AuctionCreateError extends Error {
    constructor(type: AuctionCreateErrorType, message?: AuctionCreateErrorMessages | string) {
        super(message || type);
        this.name = 'AuctionCreateError';
        this.cause = type;
    }

    cause: AuctionCreateErrorType;
}

export enum AuctionCreateErrorType {
    AUCTION_CREATE_FAILED = 'AUCTION_CREATE_FAILED'
}

export enum AuctionCreateErrorMessages {
    AUCTION_CREATE_FAILED = 'Auction create failed, please try again!'
}

/*
|| SUBMIT MESSAGE ERROR
*/
export class SubmitMessageError extends Error {
    constructor(type: SubmitMessageErrorType, message?: string) {
        super(message || type);
        this.name = 'SubmitMessageError';
        this.cause = type;
    }

    cause: SubmitMessageErrorType;
}

export enum SubmitMessageErrorType {
    SUBMIT_MESSAGE_FAILED = 'SUBMIT_MESSAGE_FAILED'
}

export enum SubmitMessageErrorMessages {
    SUBMIT_MESSAGE_FAILED = 'Submit message failed, please try again!'
}
/*
|| INTERNAL ERROR
*/

/**
 * Custom error class for internal errors
 * @class InternalError
 */
export class InternalError extends Error {
    constructor(type: InternalErrorType, message?: string) {
        super(message || type);
        this.name = 'InternalError';
        this.cause = type;
    }

    cause: InternalErrorType;
}

/**
 * Internal error types
 * @enum {string}
 */
export enum InternalErrorType {
    INTERNAL_ERROR = 'Internal error',
    NETWORK_ERROR = 'Network error',
    UNKNOWN_ERROR = 'Unknown error'
}

/**
 * Internal error messages
 * @enum {string}
 */
export enum InternalErrorMessages {
    INTERNAL_ERROR = 'Internal error!',
    NETWORK_ERROR = 'Network error, please try again!',
    UNKNOWN_ERROR = 'Unknown error!'
}

