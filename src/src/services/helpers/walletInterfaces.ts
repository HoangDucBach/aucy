import { AccountId, ContractId, Key, PublicKey, TokenId, Transaction, TransactionId } from "@hashgraph/sdk";
import { ContractFunctionParameterBuilder } from "./contractFunctionParameterBuilder";

export interface WalletInterface {
  getSigner: () => any;
  getProvider: () => any;
  getPublicKey: () => PublicKey | Promise<PublicKey> | null;
  getSignerForHashgraph: () => any;
  executeContractFunction: (contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) => Promise<TransactionId | string | null>;
  executeTransaction: (transaction: Transaction) => Promise<TransactionId | string | null>;
  disconnect: () => void;
  transferHBAR: (toAddress: AccountId, amount: number) => Promise<TransactionId | string | null>;
  transferFungibleToken: (toAddress: AccountId, tokenId: TokenId, amount: number) => Promise<TransactionId | string | null>;
  transferNonFungibleToken: (toAddress: AccountId, tokenId: TokenId, serialNumber: number) => Promise<TransactionId | string | null>;
  associateToken: (tokenId: TokenId) => Promise<TransactionId | string | null>;
  [key: string]: any;
}