// Internal imports
import { appConfig } from "@/config";
import { TAuctionCreation } from "@/types";
import {ContractExecuteTransaction, ContractFunctionParameters, Hbar} from "@hashgraph/sdk";

/**
 * Create auction
 * @param _auction - auction info
 * @param walletInterface - wallet interface
 */
export async function createAuction(_auction: TAuctionCreation, walletInterface: any) {
    const {
        tokenId,
        startingPrice,
        endingPrice,
        bidPeriod,
        duration,
    } = _auction;
    const transaction = await new ContractExecuteTransaction()
        .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        .setGas(10_000_000)
        .setMaxAttempts(10)
        .setFunction("createAuction", new ContractFunctionParameters()
            .addString(tokenId)
            .addInt64(startingPrice)
            .addInt64(endingPrice)
            .addInt64(bidPeriod)
            .addInt64(duration)
        )
        .setTransactionMemo("Create auction")
        .setFunction("greet")
        .freezeWithSigner(walletInterface.getSigner());

    const txResponse = await transaction.executeWithSigner(walletInterface.getSigner());

    // get data from response
    return txResponse;

}