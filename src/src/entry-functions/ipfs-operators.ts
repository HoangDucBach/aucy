import axios from "axios";

const gateways = [
    "https://ipfs.io/ipfs/",
    "https://gateway.pinata.cloud/ipfs/",
    "https://ipfs.crossbell.io/ipfs/",
    "https://ipfs.decentralized-content.com/ipfs/",
    "https://ipfs.4everland.io/ipfs/"
];

export async function getMetadata(metadata: any) {
    if (!metadata) return null;
    console.log('metadata data', metadata);

    const cid = atob(metadata);
    for (const gateway of gateways) {
        try {
            const response = await axios.get(`${gateway}${cid}`);
            console.log(gateway, response.data);
            return response.data;
        } catch (error) {
        }
    }
    return null;
}