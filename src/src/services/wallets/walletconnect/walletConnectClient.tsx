'use client';
// External imports
import { useCallback, useContext, useEffect } from 'react';
import {
    AccountId,
    ContractExecuteTransaction,
    ContractId,
    LedgerId,
    TokenAssociateTransaction,
    TokenId,
    TransferTransaction,
    Client,
    AccountInfoQuery,
    PublicKey
} from "@hashgraph/sdk";
import { SignClientTypes } from "@walletconnect/types";
import {
    DAppConnector,
    HederaJsonRpcMethod,
    HederaSessionEvent,
    HederaChainId,
    SignAndExecuteTransactionParams,
    transactionToBase64String
} from "@hashgraph/hedera-wallet-connect";

// Internal imports
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletInterface } from "@/services/helpers/walletInterfaces";
import { ContractFunctionParameterBuilder } from "@/services/helpers/contractFunctionParameterBuilder";
import { appConfig } from "@/config";

import EventEmitter from "events";
import { ethers } from 'ethers';

// Prepare metadata for walletconnect
const METADATA = appConfig.constants.METADATA;

// Created refreshEvent because `dappConnector.walletConnectClient.on(eventName, syncWithWalletConnectContext)` would not call syncWithWalletConnectContext
// Reference usage from walletconnect implementation https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/lib/dapp/index.ts#L120C1-L124C9
const refreshEvent = new EventEmitter();

// Create a new project in walletconnect cloud to generate a project id
const walletConnectProjectId = "377d75bb6f86a2ffd427d032ff6ea7d3";
const currentNetworkConfig = appConfig.networks.testnet;
const hederaNetwork = currentNetworkConfig.network;
const hederaClient = Client.forName(hederaNetwork)
    .setOperator(appConfig.constants.HEDERA_ACCOUNT_ID, appConfig.constants.HEDERA_PRIVATE_KEY);

// Adapted from walletconnect dapp example:
// https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/examples/typescript/dapp/main.ts#L87C1-L101C4
const metadata: SignClientTypes.Metadata = {
    name: METADATA.name,
    description: METADATA.description,
    url: METADATA.url!,
    icons: [METADATA.url + "/logo192.png"],
}
const dappConnector = new DAppConnector(
    metadata,
    LedgerId.fromString(hederaNetwork),
    walletConnectProjectId,
    Object.values(HederaJsonRpcMethod),
    [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
    [HederaChainId.Testnet],
);

// ensure walletconnect is initialized only once
let walletConnectInitPromise: Promise<void> | undefined = undefined;
const initializeWalletConnect = async () => {
    if (walletConnectInitPromise === undefined) {
        walletConnectInitPromise = dappConnector.init();
    }
    await walletConnectInitPromise;
};

export const openWalletConnectModal = async () => {
    await initializeWalletConnect();
    await dappConnector.openModal().then((x) => {
        refreshEvent.emit("sync");
    });
};
const { ethereum } = window as any;
export class WalletConnectWallet implements WalletInterface {
    public getProvider() {
        return new ethers.BrowserProvider(ethereum);
    }
    public getSigner() {
        if (dappConnector.signers.length === 0) {
            throw new Error('No signers found!');
        }
        return dappConnector.signers[0];
    }

    private getAccountId() {
        // Need to convert from walletconnect's AccountId to hashgraph/sdk's AccountId because walletconnect's AccountId and hashgraph/sdk's AccountId are not the same!
        return AccountId.fromString(this.getSigner().getAccountId().toString());
    }

    public getPublicKey(): PublicKey | null {
        new AccountInfoQuery()
            .setAccountId(this.getAccountId())
            .execute(hederaClient)
            .then((accountInfo) => {
                return accountInfo.key as PublicKey;
            })
            .catch((error) => {
                console.error(error);
            });
        return null;
    }

    async transferHBAR(toAddress: AccountId, amount: number) {
        const transferHBARTransaction = new TransferTransaction()
            .addHbarTransfer(this.getAccountId(), -amount)
            .addHbarTransfer(toAddress, amount);

        const signer = this.getSigner();
        await transferHBARTransaction.freezeWithSigner(signer);
        const txResult = await transferHBARTransaction.executeWithSigner(signer);
        return txResult ? txResult.transactionId : null;
    }

    async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
        const transferTokenTransaction = new TransferTransaction()
            .addTokenTransfer(tokenId, this.getAccountId(), -amount)
            .addTokenTransfer(tokenId, toAddress.toString(), amount);

        const signer = this.getSigner();
        await transferTokenTransaction.freezeWithSigner(signer);
        const txResult = await transferTokenTransaction.executeWithSigner(signer);
        return txResult ? txResult.transactionId : null;
    }

    async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
        const transferTokenTransaction = new TransferTransaction()
            .addNftTransfer(tokenId, serialNumber, this.getAccountId(), toAddress);

        const signer = this.getSigner();
        await transferTokenTransaction.freezeWithSigner(signer);
        const txResult = await transferTokenTransaction.executeWithSigner(signer);
        return txResult ? txResult.transactionId : null;
    }

    async associateToken(tokenId: TokenId) {
        const associateTokenTransaction = new TokenAssociateTransaction()
            .setAccountId(this.getAccountId())
            .setTokenIds([tokenId]);

        const signer = this.getSigner();
        await associateTokenTransaction.freezeWithSigner(signer);
        const txResult = await associateTokenTransaction.executeWithSigner(signer);
        return txResult ? txResult.transactionId : null;
    }

    // Purpose: build contract execute transaction and send to wallet for signing and execution
    // Returns: Promise<TransactionId | null>
    async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
        const tx = new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(gasLimit)
            .setFunction(functionName, functionParameters.buildHAPIParams());

        const signer = this.getSigner();
        await tx.freezeWithSigner(signer);
        const txResult = await tx.executeWithSigner(signer);

        // in order to read the contract call results, you will need to query the contract call's results form a mirror node using the transaction id
        // after getting the contract call results, use ethers and abi.decode to decode the call_result
        return txResult ? txResult.transactionId : null;
    }

    disconnect() {
        dappConnector.disconnectAll().then(() => {
            refreshEvent.emit("sync");
        });
    }
};
export const walletConnectWallet = new WalletConnectWallet();

// this component will sync the walletconnect state with the context
export const WalletConnectClient = () => {
    // use the HashpackContext to keep track of the hashpack account and connection
    const { setAccountId, setIsConnected } = useContext(WalletConnectContext);

    // sync the walletconnect state with the context
    const syncWithWalletConnectContext = useCallback(() => {
        const accountId = dappConnector.signers[0]?.getAccountId()?.toString();
        if (accountId) {
            setAccountId(accountId);
            setIsConnected(true);
        } else {
            setAccountId('');
            setIsConnected(false);
        }
    }, [setAccountId, setIsConnected]);

    useEffect(() => {
        // Sync after walletconnect finishes initializing
        refreshEvent.addListener("sync", syncWithWalletConnectContext);

        initializeWalletConnect().then(() => {
            syncWithWalletConnectContext();
        });

        return () => {
            refreshEvent.removeListener("sync", syncWithWalletConnectContext);
        }
    }, [syncWithWalletConnectContext]);
    return null;
};