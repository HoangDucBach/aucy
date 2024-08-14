// External imports
import { ethers } from "ethers";

// Internal imports
import { appConfig } from "@/config";
import { AccountError, AccountErrorType, AuctionDonationError, AuctionDonationErrorType, IdentityError, IdentityErrorType } from "@/types";
import { WalletInterface } from "@/services/helpers/walletInterfaces";
import { submitAMessage } from "./hedera-operators";
import { ContractExecuteTransaction, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";
import client from "@/utils/hederaClient";
// import walletConnectSdk from "@/utils/walletConnectSdk";
/**
 * Donate to the auction contract
 * @param auctionId - The ID of the auction
 * @param amount - The donation amount
 * @param walletInterface - Wallet interface
 */
export async function donate(auctionId: string, amount: number, walletInterface: WalletInterface) {
    if (!walletInterface) throw new AccountError(AccountErrorType.ACCOUNT_NOT_CONNECTED);
    if (!auctionId) throw new IdentityError(IdentityErrorType.IDENTITY_NOT_FOUND);
    
    try {
        const transaction = await new ContractExecuteTransaction()
            .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
            .setGas(1_000_000)
            .setMaxAttempts(10)
            .setFunction("donate",
                new ContractFunctionParameters()
                    .addAddress(auctionId)
            )
            .setPayableAmount(new Hbar(amount))
            .setTransactionMemo("Donate to auction contract")
            .freezeWithSigner(walletInterface.getSigner());
        const txResponse = await transaction.executeWithSigner(walletInterface.getSigner());
        const record = await txResponse.getRecord(client);
        const result = record.contractFunctionResult;

        return result;
        
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}