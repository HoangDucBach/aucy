import { AccountId, ContractId, Key, PublicKey, TokenId, TransactionId } from "@hashgraph/sdk";
import { ContractFunctionParameterBuilder } from "./contractFunctionParameterBuilder";

export interface WalletInterface {
  getSigner: () => any;
  getPublicKey: () => PublicKey | null;
  executeContractFunction: (contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) => Promise<TransactionId | string | null>;
  disconnect: () => void;
  transferHBAR: (toAddress: AccountId, amount: number) => Promise<TransactionId | string | null>;
  transferFungibleToken: (toAddress: AccountId, tokenId: TokenId, amount: number) => Promise<TransactionId | string | null>;
  transferNonFungibleToken: (toAddress: AccountId, tokenId: TokenId, serialNumber: number) => Promise<TransactionId | string | null>;
  associateToken: (tokenId: TokenId) => Promise<TransactionId | string | null>;
}