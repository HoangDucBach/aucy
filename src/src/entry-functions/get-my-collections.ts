// External imports
import axios, {AxiosResponse} from "axios";

// Internal imports
import {appConfig} from "@/config";
import {TQuery} from "@/types";

/**
 * Get my collections
 * @param accountId - Hedera account ID or evm address
 * @param query - query params
 * @returns - AccountInfo
 */
export async function getMyCollections(accountId: string, query?: TQuery): Promise<AxiosResponse<any, any>> {
    if (!accountId) throw new Error('Account ID is required to get collections');
    const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/accounts/${accountId}/tokens`;

    return await axios.get(endpoint, {
        params: {
            ...query
        },
    });
}