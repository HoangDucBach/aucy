// External imports
import { Client } from "@hashgraph/sdk";
import envConfig from "dotenv-flow";

envConfig.config({node_env: "test"});

const client = Client.forTestnet()
    .setOperator(process.env.HEDERA_ACCOUNT_ID as string, process.env.HEDERA_DER_PRIVATE_KEY as string);

export default client;