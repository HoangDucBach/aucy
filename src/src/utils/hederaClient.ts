// External imports
import { Client } from "@hashgraph/sdk";
import { appConfig } from "@/config";

const client = Client.forTestnet();
try {
    client.setOperator(appConfig.constants.HEDERA_ACCOUNT_ID as string, appConfig.constants.HEDERA_PRIVATE_KEY as string)
    .setNetwork(appConfig.constants.HEDERA_NETWORK as string);
} catch (error) {
    console.error('Error setting operator', error);
}


export default client;