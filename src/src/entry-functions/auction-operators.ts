// External imports
import {
    ContractExecuteTransaction,
    ContractFunctionParameters,
    ContractCallQuery,
    ContractId, Hbar,
    EvmAddress,
} from "@hashgraph/sdk";

// Internal imports
import { appConfig } from "@/config";
import { AccountError, AccountErrorType, IdentityError, IdentityErrorType, TAuction, TAuctionCreation, TBid } from "@/types";
import client from "@/utils/hederaClient";
import { ErrorFragment, ethers } from "ethers";
import { WalletInterface } from "@/services/helpers/walletInterfaces";
import { createTopic, submitAMessage } from "./hedera-operators";

const MAX_GAS = 1_000_000;
const MAX_ATTEMPTS = 10;
const contractInterface = new ethers.Interface(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ABI);
/**
 * Create auction
 * @param _auction - auction info
 * @param walletInterface - wallet interface
 */
export async function createAuction(_auction: TAuctionCreation, walletInterface: WalletInterface) {
    const {
        name,
        description,
        tokenId,
        tokenAddress,
        startingPrice,
        minBidIncrement,
        endingPrice,
        endingAt,
        receivers,
        percentages
    } = _auction;
    if (!name) throw new Error('Name is required');
    if (!description) throw new Error('Description is required');
    if (!tokenAddress) throw new Error('Token address is required');
    if (!tokenId) throw new Error('Token ID is required');
    if (!startingPrice) throw new Error('Starting price is required');
    if (!minBidIncrement) throw new Error('Minimum bid increment is required');
    if (!endingPrice) throw new Error('Ending price is required');
    if (!endingAt) throw new Error('Ending time is required');

    try {

        // const transaction = await new ContractExecuteTransaction()
        //     .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        //     .setGas(MAX_GAS)
        //     .setMaxAttempts(MAX_ATTEMPTS)
        //     .setPayableAmount(new Hbar(100, HbarUnit.Tinybar))
        //     .setFunction("createAuction", new ContractFunctionParameters()
        //         .addString(name)
        //         .addString(description)
        //         .addAddress(ContractId.fromString(tokenAddress).toSolidityAddress())
        //         .addInt256(tokenId.toString())
        //         .addInt256(startingPrice.toString())
        //         .addInt256(minBidIncrement.toString())
        //         .addInt256(endingPrice.toString())
        //         .addInt256(endingAt.toString())
        //         .addAddressArray(receivers!)
        //         .addInt16Array(percentages!)
        //     )
        // .freezeWithSigner(walletInterface.getSigner())
        // .freezeWith(client);

        // const sign = await transaction.signWithSigner(walletInterface.getSigner());

        if (!walletInterface) throw new AccountError(AccountErrorType.ACCOUNT_NOT_CONNECTED);
        const contractAddress = appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ADDRESS;
        const signer = await walletInterface.getProvider().getSigner();
        const account = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress, appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ABI, signer);
        const topicId = await createTopic(walletInterface);
        const tx = await contract.createAuction(
            name,
            description,
            ContractId.fromString(tokenAddress).toSolidityAddress(),
            tokenId,
            topicId?.toSolidityAddress(),
            startingPrice,
            minBidIncrement,
            endingPrice,
            endingAt,
            receivers,
            percentages
        );
        await tx.wait();

        // await submitAMessage(appConfig.constants.AUCY_TOPIC_ID, `${account} has created an auction`, walletInterface);

        return tx;
    } catch (error: any) {
        console.error('Error creating auction', error);
        if (error instanceof ErrorFragment) {
            throw new Error(error.name)
        }
        throw new Error(error);
    }

}

/**
 * End auction
 * @param auctionId - The address of the auction to be ended
 * @param walletInterface - Wallet interface
 */
export async function endAuction(auctionId: string, walletInterface: any) {
    // const transaction = await new ContractExecuteTransaction()
    //     .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
    //     .setGas(MAX_GAS)
    //     .setMaxAttempts(MAX_ATTEMPTS)
    //     .setFunction("endAuction", new ContractFunctionParameters()
    //         .addAddress(auctionId)
    //     )
    //     .setTransactionMemo("End auction")
    //     .freezeWithSigner(walletInterface.getSigner());

    // const txResponse = await transaction.executeWithSigner(walletInterface.getSigner());

    // const record = await txResponse.getRecord(client);

    // const result = record.contractFunctionResult;

    // return result;
    if (!auctionId) throw new IdentityError(IdentityErrorType.IDENTITY_NOT_FOUND);
    if (!walletInterface) throw new AccountError(AccountErrorType.ACCOUNT_NOT_CONNECTED);

    try {
        const contractAddress = appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ADDRESS;
        const signer = await walletInterface.getProvider().getSigner();
        const account = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress, appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ABI, signer);

        const tx = await contract.endAuction(auctionId);
        await tx.wait();
        await submitAMessage(appConfig.constants.AUCY_TOPIC_ID, `${account} has ended an auction`, walletInterface);
        return true;

    } catch (error: any) {
        console.error('Error ending auction', error);
        throw new Error(error);
    }
}

/**
 * Cancel auction
 * @param auctionId - The ID of the auction to be canceled
 * @param walletInterface - Wallet interface
 */
export async function cancelAuction(auctionId: string, walletInterface: any) {
    const transaction = await new ContractExecuteTransaction()
        .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        .setGas(MAX_GAS)
        .setMaxAttempts(MAX_ATTEMPTS)
        .setFunction("cancelAuction", new ContractFunctionParameters()
            .addString(auctionId)
        )
        .setTransactionMemo("Cancel auction")
        .freezeWithSigner(walletInterface.getSigner());

    const txResponse = await transaction.executeWithSigner(walletInterface.getSigner());

    const record = await txResponse.getRecord(client);

    const result = record.contractFunctionResult;

    return result;
}

export function _getAuctionByResult(result: any): TAuction {
    let index = 0;
    const auction = {
        id: result[index++],
        topicId: result[index++],
        name: result[index++],
        description: result[index++],
        seller: result[index++],
        tokenAddress: result[index++],
        tokenId: BigInt(result[index++]),
        startingPrice: BigInt(result[index++]),
        minBidIncrement: BigInt(result[index++]),
        endingPrice: BigInt(result[index++]),
        startedAt: BigInt(result[index++]),
        endingAt: BigInt(result[index++]),
        endedAt: BigInt(result[index++]),
        highestBid: BigInt(result[index++]),
        highestBidder: result[index++],
        donation: BigInt(result[index++]),
        receivers: result[index++],
        percentages: result[index++],
    } satisfies TAuction;
    if (auction.id === ethers.ZeroAddress) {
        throw new IdentityError(IdentityErrorType.IDENTITY_NOT_FOUND);
    }
    return auction;
}
export async function getAuction(auctionId: string) {
    try {
        const transaction = await new ContractCallQuery()
            .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
            .setGas(MAX_GAS)
            .setMaxAttempts(MAX_ATTEMPTS)
            .setMaxQueryPayment(new Hbar(5))
            .setFunction("getAuction", new ContractFunctionParameters()
                .addAddress(EvmAddress.fromString(auctionId))
            )
            .execute(client);

        const result = transaction;
        const resultArray = new ethers.Interface(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ABI).decodeFunctionResult("getAuction", result.asBytes())[0];
        const auction = _getAuctionByResult(resultArray);
        return auction;
    } catch (error: any) {
        console.error('Error getting auction', error);
        throw new Error(error);
    }
}

/**
 * Get auctions
 */
export async function getAuctions() {
    try {
        const transaction = await new ContractCallQuery()
            .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
            .setGas(MAX_GAS)
            .setMaxAttempts(MAX_ATTEMPTS)
            .setMaxQueryPayment(new Hbar(5))
            .setFunction("getAuctions", new ContractFunctionParameters())
            .execute(client);

        const result = transaction;
        const resultArray = contractInterface.decodeFunctionResult("getAuctions", result.asBytes())[0];

        const auctions: TAuction[] = [];

        resultArray.forEach((auction: any) => {
            auctions.push(_getAuctionByResult(auction));
        });

        return auctions;

    } catch (error: any) {
        console.error('Error getting auction', error);
    }
}
/**
 * Get bids for an auction
 * @param auctionId - The ID of the auction
 * @param walletInterface - Wallet interface
 */
export async function getBids(auctionId: string, walletInterface: any): Promise<TBid[]> {
    const transaction = await new ContractCallQuery()
        .setContractId(appConfig.constants.AUCY_CONTRACT_NFT_AUCTION_MANAGER_ID)
        .setGas(MAX_GAS)
        .setMaxAttempts(MAX_ATTEMPTS)
        .setFunction("bids", new ContractFunctionParameters()
            .addAddress(auctionId)
        )
        .execute(client);

    const result = transaction;
    const bidCount = Number(BigInt(result.getInt256(0).toString()));
    const bids: TBid[] = [];

    for (let i = 0; i < bidCount; i++) {
        bids.push({
            bidder: result.getAddress(i * 4 + 1),
            auctionId: auctionId,
            amount: BigInt(result.getInt256(i * 4 + 2).toString()),
            timestamp: BigInt(result.getInt256(i * 4 + 3).toString()),
        });
    }

    return bids;
}