import { AccountId, AccountInfoQuery, PublicKey } from "@hashgraph/sdk";
import client from './hederaClient'
export async function getPublicKey(accountId: AccountId |string): Promise<PublicKey | null> {
    const accountInfo= await new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(client);
    if(accountInfo){
        return accountInfo.key as PublicKey;
    }
    return null;
}