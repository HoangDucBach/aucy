// External imports
import {Client} from "@hashgraph/sdk";
import {appConfig} from "@/config";

const client = Client.forTestnet();
client.setOperator(appConfig.constants.HEDERA_ACCOUNT_ID as string, appConfig.constants.HEDERA_PRIVATE_KEY as string)
    .setNetwork(appConfig.constants.HEDERA_NETWORK as string);


export default client;