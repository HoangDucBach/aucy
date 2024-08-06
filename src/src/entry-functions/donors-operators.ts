// External imports
import { ContractExecuteTransaction, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";

// Internal imports
import { appConfig } from "@/config";
import { client } from "./heplers";

/**
 * Donate to the auction contract
 * @param amount - The donation amount
 * @param walletInterface - Wallet interface
 */
export async function donate(amount: number, walletInterface: any) {
    const transaction = await new ContractExecuteTransaction()
        .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        .setGas(10_000_000)
        .setMaxAttempts(10)
        .setFunction("donate", new ContractFunctionParameters())
        .setPayableAmount(new Hbar(amount))
        .setTransactionMemo("Donate to auction contract")
        .freezeWithSigner(walletInterface.getSigner());

    const txResponse = await transaction.executeWithSigner(walletInterface.getSigner());

    const record = await txResponse.getRecord(client);

    const result = record.contractFunctionResult;

    return result;
}