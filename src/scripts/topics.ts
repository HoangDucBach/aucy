// External imports
import { ContractCreateTransaction, Hbar, FileCreateTransaction, Client, TopicCreateTransaction, PrivateKey } from "@hashgraph/sdk";
import envConfig from "dotenv";

// Internal imports

envConfig.config({
    path: ".env.development",
})

const client = Client.forTestnet()
    .setOperator(process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID as string, process.env.NEXT_PUBLIC_HEDERA_DER_PRIVATE_KEY as string);
const operatorKey = PrivateKey.fromStringECDSA(process.env.NEXT_PUBLIC_HEDERA_DER_PRIVATE_KEY as string);

async function createTopics() {
    const txTransaction = new TopicCreateTransaction()
        .setAdminKey(operatorKey);
    const txResponse = await txTransaction.execute(client);
    const txReceipt = await txResponse.getReceipt(client);
    console.log(`Topic ID: ${txReceipt.topicId}`);
}

createTopics();