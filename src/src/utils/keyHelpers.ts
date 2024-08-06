import { AccountId, AccountInfoQuery, PublicKey } from "@hashgraph/sdk";
import client from './hederaClient'
export function getPublicKey(accountId: AccountId |string): PublicKey | null {
    new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(client)
        .then((accountInfo) => {
            return accountInfo.key as PublicKey;
        })
        .catch((error) => {
            console.error(error);
        });
    return null;
}