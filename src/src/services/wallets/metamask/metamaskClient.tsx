'use client';

import { ContractId, AccountId, PublicKey, AccountInfoQuery, EvmAddress, LedgerId, Key, AccountBalanceQuery, Transaction, AccountRecordsQuery } from "@hashgraph/sdk";
import { TokenId } from "@hashgraph/sdk/lib/transaction/TransactionRecord";
import { ethers, TransactionRequest } from "ethers";
import { useContext, useEffect } from "react";
import { appConfig } from "@/config";
import { MetamaskContext } from "@/contexts";
import { ContractFunctionParameterBuilder } from "@/services/helpers/contractFunctionParameterBuilder";
import { WalletInterface } from "@/services/helpers/walletInterfaces";
import { toast } from "react-toastify";
import hederaClient from "@/utils/hederaClient";
import { DAppConnector, DAppSigner, HederaChainId, HederaJsonRpcMethod, HederaSessionEvent } from "@hashgraph/hedera-wallet-connect";
import { ISignClient, SignClientTypes } from "@walletconnect/types";
import { SignClient } from "@walletconnect/sign-client";
import client from "@/utils/hederaClient";
import { METADATA } from "@/config/constants";

const currentNetworkConfig = appConfig.networks.testnet;

export const switchToHederaNetwork = async (ethereum: any) => {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: currentNetworkConfig.chainId }] // chainId must be in hexadecimal numbers
        });
    } catch (error: any) {
        if (error.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: `Hedera (${currentNetworkConfig.network})`,
                            chainId: currentNetworkConfig.chainId,
                            nativeCurrency: {
                                name: 'HBAR',
                                symbol: 'HBAR',
                                decimals: 18
                            },
                            rpcUrls: [currentNetworkConfig.jsonRpcUrl]
                        },
                    ],
                });
            } catch (addError) {
                console.error(addError);
            }
        }
        console.error(error);
    }
}

let ethereum: any;
if(typeof window !== 'undefined') {
    ethereum = (window as any).ethereum;
}
const getProvider = () => {
    if (!ethereum) {
        throw new Error("Metamask is not installed! Go install the extension!");
    }

    return new ethers.BrowserProvider(ethereum);
}

// returns a list of accounts
// otherwise empty array
export const connectToMetamask = async () => {
    const provider = getProvider();

    // keep track of accounts returned
    let accounts: string[] = []

    try {
        await switchToHederaNetwork(ethereum);
        accounts = await provider.send("eth_requestAccounts", []);
    } catch (error: any) {
        if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            throw new Error("Please connect to MetaMask.");
        } else {
            console.error(error);
        }
    }

    return accounts;
}

// export class MetaMaskSigner implements Signer {
//     private provider: ethers.BrowserProvider;
//     private signer: ethers.Signer | null;
//     private client: import("@hashgraph/sdk").Client = client;

//     async getSigner(): Promise<ethers.Signer> {
//         if (!this.signer) {
//             this.signer = await this.provider.getSigner();
//         }
//         return this.signer;
//     }

//     async getProvider(): Promise<ethers.BrowserProvider> {
//         return this.provider;
//     }

//     async initialize() {
//         this.signer = await this.provider.getSigner();
//     }
//     constructor() {
//         this.provider = new ethers.BrowserProvider((window as any).ethereum);
//         this.signer = null;
//     }

//     getLedgerId(): LedgerId | null {
//         return LedgerId.TESTNET; // or MAINNET based on your configuration
//     }

//     getAccountId(): AccountId {
//         this.getSigner()
//             .then(async (signer) => {
//                 const address = await signer.getAddress();
//                 return AccountId.fromEvmAddress(0, 0, address);
//             })
//         throw new Error("Failed to get account ID");
//     }

//     getPublicKey(): PublicKey {
//         this.getSigner()
//             .then(async (signer) => {
//                 const address = await signer.getAddress();
//                 const encoder = new TextEncoder();
//                 const uint8Array = encoder.encode(address);
//                 return PublicKey.fromBytes(uint8Array);
//             })
//         throw new Error("Failed to get account key");
//     }

//     getNetwork(): { [key: string]: string | AccountId } {
//         return {
//             "network": "testnet",
//             "chainId": "0x128",
//             "accountId": this.getAccountId()
//         };
//     }

//     getMirrorNetwork(): string[] {
//         return [appConfig.networks.testnet.mirrorNodeUrl];
//     }

//     async sign(messages: Uint8Array[]): Promise<SignerSignature[]> {
//         const signatures: SignerSignature[] = [];
//         for (const message of messages) {
//             const signature = await (await this.getSigner()).signMessage(message);
//             signatures.push({
//                 accountId: this.getAccountId(),
//                 signature: (new TextEncoder()).encode(signature),
//                 publicKey: this.getPublicKey()
//             });
//         }
//         return signatures;
//     }

//     async getAccountBalance(): Promise<AccountBalance> {
//         const accountId = this.getAccountId();
//         const balance = await new AccountBalanceQuery()
//             .setAccountId(accountId)
//             .execute(this.client);
//         return balance;
//     }

//     async getAccountInfo(): Promise<AccountInfo> {
//         const accountId = await this.getAccountId();
//         const info = await new AccountInfoQuery()
//             .setAccountId(accountId)
//             .execute(this.client);
//         return info;
//     }

//     async getAccountRecords(): Promise<TransactionRecord[]> {
//         const accountId = await this.getAccountId();
//         const records = await new AccountRecordsQuery()
//             .setAccountId(accountId)
//             .execute(this.client);
//         return records;
//     }

//     async signTransaction<T extends Transaction>(transaction: T): Promise<T> {
//         const ethersTransactionRequest = await this.populateTransaction(transaction);
//         const signedTransaction = await (await this.getSigner()).signTransaction(ethersTransactionRequest as TransactionRequest);
//         return signedTransaction as any;
//     }

//     async checkTransaction<T_1 extends import("@hashgraph/sdk").default>(transaction: T_1): Promise<T_1> {
//         // Implement transaction checking logic if needed
//         return transaction;
//     }

//     async populateTransaction<T_2 extends Transaction>(transaction: T_2): Promise<T_2> {
//         const {
//             nodeAccountIds,
//             transactionId,
//             transactionValidDuration,
//             maxTransactionFee,
//             transactionMemo,
//             // Add other properties as needed
//         } = transaction;

//         try {
//             const ethersTransactionRequest: TransactionRequest = {
//                 to: nodeAccountIds![0].toString(),
//                 nonce: transactionId!.nonce,
//                 gasLimit: maxTransactionFee?.toBigNumber().toNumber(),
//                 data: transactionMemo,
//             }
//             return ethersTransactionRequest as T_2;
//         } catch (error: any) {
//             console.error(error);
//             throw new Error("Failed to populate transaction");
//         }

//     }

//     async call<RequestT, ResponseT, OutputT>(): Promise<OutputT> {
//         // Implement call logic if needed
//         return request.execute(this.client);
//     }
// }
export class MetaMaskWallet implements WalletInterface {
    public getProvider() {
        return new ethers.BrowserProvider(ethereum);
    }
    public async getPublicKey(): Promise<PublicKey> {
        const provider = this.getProvider();
        try {
            const accounts = await provider.listAccounts();
            if (accounts.length !== 0) {
                const address = await accounts[0].getAddress();
                const accountInfo = await new AccountInfoQuery()
                    .setAccountId(AccountId.fromEvmAddress(0, 0, EvmAddress.fromString(address)))
                    .execute(client);
                return accountInfo.key as PublicKey;
            } else {
                throw new Error('No accounts found');
            }
        } catch (error) {
            console.error(error);
            throw new Error('Failed to get public key');
        }
    }

    private convertAccountIdToSolidityAddress(accountId: AccountId): string {
        const accountIdString = accountId.evmAddress !== null
            ? accountId.evmAddress.toString()
            : accountId.toSolidityAddress();

        return `0x${accountIdString}`;
    }
    async getSigner() {
        try {

            const provider = getProvider();
            const signer = provider.getSigner();
            console.log("Signer:", signer);
            return signer;
        } catch (error: any) {
            toast.error(error.message ? error.message : error);
        }
    }
    async getSignerForHashgraph() {
        const signClient = await SignClient.init({
            projectId: appConfig.constants.WALLETCONNECT_PROJECT_ID,
            name: appConfig.constants.WALLETCONNECT_PROJECT_NAME,
            metadata: {
                description: appConfig.constants.METADATA.description,
                url: appConfig.constants.METADATA.url,
                icons: [appConfig.constants.METADATA.icon],
                name: appConfig.constants.METADATA.name,
            }
        });
        const metadata: SignClientTypes.Metadata = {
            name: METADATA.name,
            description: METADATA.description,
            url: METADATA.url!,
            icons: [METADATA.url + "/logo192.png"],
        }
        const dappConnector = new DAppConnector(
            metadata,
            LedgerId.fromString(appConfig.networks.testnet.network),
            appConfig.constants.WALLETCONNECT_PROJECT_ID,
            Object.values(HederaJsonRpcMethod),
            [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
            [HederaChainId.Testnet],
        );
        return null;
    }
    // Purpose: Transfer HBAR
    // Returns: Promise<string>
    // Note: Use JSON RPC Relay to search by transaction hash
    async transferHBAR(toAddress: AccountId, amount: number) {
        const provider = getProvider();
        const signer = await provider.getSigner();
        // build the transaction
        const tx = await signer.populateTransaction({
            to: this.convertAccountIdToSolidityAddress(toAddress),
            value: ethers.parseEther(amount.toString()),
        });
        try {
            // send the transaction
            const { hash } = await signer.sendTransaction(tx);
            await provider.waitForTransaction(hash);

            return hash;
        } catch (error: any) {
            console.warn(error.message ? error.message : error);
            return null;
        }
    }

    async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
        const hash = await this.executeContractFunction(
            ContractId.fromString(tokenId.toString()),
            'transfer',
            new ContractFunctionParameterBuilder()
                .addParam({
                    type: "address",
                    name: "recipient",
                    value: this.convertAccountIdToSolidityAddress(toAddress)
                })
                .addParam({
                    type: "uint256",
                    name: "amount",
                    value: amount
                }),
            appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_FT
        );

        return hash;
    }

    async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
        const provider = getProvider();
        const addresses = await provider.listAccounts();
        const hash = await this.executeContractFunction(
            ContractId.fromString(tokenId.toString()),
            'transferFrom',
            new ContractFunctionParameterBuilder()
                .addParam({
                    type: "address",
                    name: "from",
                    value: addresses[0]
                })
                .addParam({
                    type: "address",
                    name: "to",
                    value: this.convertAccountIdToSolidityAddress(toAddress)
                })
                .addParam({
                    type: "uint256",
                    name: "nftId",
                    value: serialNumber
                }),
            appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_NFT
        );

        return hash;
    }

    async associateToken(tokenId: TokenId) {
        // send the transaction
        // convert tokenId to contract id
        const hash = await this.executeContractFunction(
            ContractId.fromString(tokenId.toString()),
            'associate',
            new ContractFunctionParameterBuilder(),
            appConfig.constants.METAMASK_GAS_LIMIT_ASSOCIATE
        );

        return hash;
    }

    // Purpose: build contract execute transaction and send to hashconnect for signing and execution
    // Returns: Promise<TransactionId | null>
    async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
        const provider = getProvider();
        const signer = await provider.getSigner();
        const abi = [
            `function ${functionName}(${functionParameters.buildAbiFunctionParams()})`
        ];

        // create contract instance for the contract id
        // to call the function, use contract[functionName](...functionParameters, ethersOverrides)
        const contract = new ethers.Contract(`0x${contractId.toSolidityAddress()}`, abi, signer);
        try {
            const txResult = await contract[functionName](
                ...functionParameters.buildEthersParams(),
                {
                    gasLimit: gasLimit === -1 ? undefined : gasLimit
                }
            );
            return txResult.hash;
        } catch (error: any) {
            console.warn(error.message ? error.message : error);
            return null;
        }
    }
    async executeTransaction(transaction: Transaction) {
        const provider = getProvider();
        const signer = await provider.getSigner();
        
        const tx = await signer.populateTransaction({
            to: transaction.nodeAccountIds![0].toString(),
            gasLimit: transaction.maxTransactionFee?.toBigNumber().toNumber(),
            data: transaction.transactionMemo,
        });

        try {
            const { hash } = await signer.sendTransaction(tx);
            await provider.waitForTransaction(hash);
            return hash;
        } catch (error: any) {
            console.warn(error.message ? error.message : error);
            return null;
        }
    }
    disconnect() {
        const provider = getProvider();
        provider.removeAllListeners();
    }
};

export const metamaskWallet = new MetaMaskWallet();

export const MetaMaskClient = () => {
    const { setMetamaskAccountAddress } = useContext(MetamaskContext);
    useEffect(() => {
        // set the account address if already connected
        try {
            const provider = getProvider();
            provider.listAccounts().then((accounts) => {
                if (accounts.length !== 0) {
                    accounts[0].getAddress().then((address) => {
                        setMetamaskAccountAddress(address);
                    });
                } else {
                    setMetamaskAccountAddress("");
                }
            });

            // listen for account changes and update the account address
            ethereum.on("accountsChanged", (accounts: string[]) => {
                if (accounts.length !== 0) {
                    setMetamaskAccountAddress(accounts[0]);
                } else {
                    setMetamaskAccountAddress("");
                }
            });

            // cleanup by removing listeners
            return () => {
                ethereum.removeAllListeners("accountsChanged");
            }
        } catch (error: any) {
            toast.error(error.message ? error.message : error);
        }
    }, [setMetamaskAccountAddress]);

    return null;
}
