import { NetworkConfigs } from "./type"

export const networkConfig: NetworkConfigs = {
    testnet: {
        network: "testnet",
        jsonRpcUrl: "https://testnet.hashio.io/api", // check out the readme for alternative RPC Relay urls
        mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
        chainId: "0x128",
    },
    previewnet: {
        network: "previewnet",
        jsonRpcUrl: "https://previewnet.hashio.io/api",
        mirrorNodeUrl: "https://previewnet.mirrornode.hedera.com",
        chainId: "0x128",
    },
}