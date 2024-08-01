// Internal imports
import {appConfig} from "@/config";
import axios from "axios";
import {TQuery} from "@/types";

/**
 * Get account info
 * @param accountId - Hedera account ID or evm address
 * @param query - query params
 */
export async function getAccountInfo(accountId: string, query?: TQuery) {
    if (!accountId) throw new Error('Account ID is required to get collections');
    const endpoint = `${appConfig.constants.HEDERA_API_ENDPOINT}/accounts/${accountId}`;

    return await axios.get(endpoint, {
        params: {
            ...query
        },
    });
}