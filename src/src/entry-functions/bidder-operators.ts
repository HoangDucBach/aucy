// External imports
import { ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";

// Internal imports
import { appConfig } from "@/config";
import { client } from "./heplers";

/**
 * Place a bid on an auction
 * @param auctionId - The ID of the auction
 * @param amount - The bid amount
 * @param walletInterface - Wallet interface
 */
export async function placeBid(auctionId: string, amount: number, walletInterface: any) {
    const transaction = await new ContractExecuteTransaction()
        .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        .setGas(10_000_000)
        .setMaxAttempts(10)
        .setFunction("placeBid", new ContractFunctionParameters()
            .addString(auctionId)
            .addInt256(amount)
        )
        .setTransactionMemo("Place bid")
        .freezeWithSigner(walletInterface.getSigner());

    const txResponse = await transaction.executeWithSigner(walletInterface.getSigner());

    const record = await txResponse.getRecord(client);

    const result = record.contractFunctionResult;

    return result;
}

/**
 * Withdraw a bid from an auction
 * @param auctionId - The ID of the auction
 * @param walletInterface - Wallet interface
 */
export async function withdrawBid(auctionId: string, walletInterface: any) {
    const transaction = await new ContractExecuteTransaction()
        .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        .setGas(10_000_000)
        .setMaxAttempts(10)
        .setFunction("withdrawBid", new ContractFunctionParameters()
            .addString(auctionId)
        )
        .setTransactionMemo("Withdraw bid")
        .freezeWithSigner(walletInterface.getSigner());

    const txResponse = await transaction.executeWithSigner(walletInterface.getSigner());
    const record = await txResponse.getRecord(client);
    const result = record.contractFunctionResult;
    return result;
}

/**
 * Get the highest bid of an auction
 * @param auctionId - The ID of the auction
 * @param walletInterface - Wallet interface
 */
export async function getHighestBid(auctionId: string, walletInterface: any) {
    const transaction = await new ContractCallQuery()
        .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        .setGas(10_000_000)
        .setMaxAttempts(10)
        .setFunction("getHighestBid", new ContractFunctionParameters()
            .addString(auctionId)
        )

    const txTransaction = await transaction.execute(client);
    const result = txTransaction.getUint256(0);
    return result;
}

/**
 * Get the highest bidder of an auction
 * @param auctionId - The ID of the auction
 * @param walletInterface - Wallet interface
 */
export async function getHighestBidder(auctionId: string, walletInterface: any) {
    const transaction = await new ContractCallQuery()
        .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        .setGas(10_000_000)
        .setMaxAttempts(10)
        .setFunction("getHighestBidder", new ContractFunctionParameters()
            .addString(auctionId)
        )

    const txTransaction = await transaction.execute(client);
    const result = txTransaction.getString(0);
    return result;
}