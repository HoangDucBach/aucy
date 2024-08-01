// External imports
import axios, {AxiosResponse} from "axios";

// Internal imports
import {appConfig} from "@/config";
import {TQuery} from "@/types";
import {TokenInfo} from "@hashgraph/sdk";

/**
 * Get token info
 * @param tokenId - Hedera token ID
 * @param query
 */
export async function getTokenInfo(tokenId: string, query?: TQuery): Promise<AxiosResponse<TokenInfo, any>> {
    if (!tokenId) throw new Error('Account ID is required to get collections');
    const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/tokens/${tokenId}`;

    return await axios.get(endpoint, {
        params: {
            ...query
        },
    });
}