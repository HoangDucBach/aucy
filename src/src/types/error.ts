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

