// External imports
import { ContractCreateTransaction, Hbar, FileCreateTransaction } from "@hashgraph/sdk";

// Internal imports
import byteCode from '../../artifacts/contracts/auction/NFTAuctionManager.sol/NFTAuctionManager.json';
import client from './client';

async function storeBytecode() {
    const bytecode = byteCode.bytecode as string;

    //Create a file on Hedera and store the hex-encoded bytecode
    const fileCreateTx = new FileCreateTransaction()
        //Set the bytecode of the contract
        .setContents(bytecode.substring(2));
        

    //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
    const submitTx = await fileCreateTx.execute(client);

    //Get the receipt of the file create transaction
    const fileReceipt = await submitTx.getReceipt(client);

    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.fileId;

    if (bytecodeFileId === null) {
        throw new Error("File create transaction failed");
    }
    return bytecodeFileId.toString();
}
async function deploy() {
    const fileId = await storeBytecode()
    // Instantiate the contract instance
    const contractTx = new ContractCreateTransaction()
        //Set the file ID of the Hedera file storing the bytecode
        .setBytecodeFileId(fileId)
        //Set the gas to instantiate the contract
        .setGas(20000000);

    //Submit the transaction to the Hedera test network
    const contractResponse = await contractTx.execute(client);

    //Get the receipt of the file create transaction
    const contractReceipt = await contractResponse.getReceipt(client);

    //Get the smart contract ID
    const newContractId = contractReceipt.contractId;

    //Log the smart contract ID
    console.log("The smart contract ID is " + newContractId);

    //v2 JavaScript SDK
}
export default deploy;