// External imports
import { ethers } from "ethers";

// Internal imports
import { appConfig } from "@/config";
import { AccountError, AccountErrorType, AuctionDonationError, AuctionDonationErrorType, IdentityError, IdentityErrorType } from "@/types";
import { WalletInterface } from "@/services/helpers/walletInterfaces";
import { submitAMessage } from "./hedera-operators";
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
    const contractAddress = appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ADDRESS;
    const signer = await walletInterface.getProvider().getSigner();
    const account = await signer.getAddress();
    try {
        /**
         * Bug: Transaction maybe has success (including the receipt) but
         * the contract function result is not returned, output is none
         * 
         */
        /// Transaction maybe has success (including the receipt) but
        /// the contract function result is not returned, output is none

        // const transaction = await new ContractExecuteTransaction()
        //     .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        //     .setGas(1_000_000)
        //     .setMaxAttempts(10)
        //     .setFunction("donate", new ContractFunctionParameters())
        //     .setPayableAmount(new Hbar(amount))
        //     .setTransactionMemo("Donate to auction contract")
        //     .freezeWithSigner(walletInterface.getSigner());
        // const txResponse = await transaction.executeWithSigner(walletInterface.getSigner());
        // const record = await txResponse.getRecord(client);
        // const result = record.contractFunctionResult;
        // return result;

        // Use ethers of hardhat to interact with the contract
        const contract = new ethers.Contract(contractAddress, appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ABI, signer);
        const tx = await contract.donate(auctionId, {
            value: ethers.parseEther(amount.toString())
        });
        await tx.wait();

        // Submit message to topic
        const topicId = appConfig.constants.AUCY_TOPIC_ID;
        await submitAMessage(topicId, `${account} has donated ${amount} HBAR`, walletInterface);
        return true;

    } catch (error: any) {
        console.error(error);
        throw error;
    }
}