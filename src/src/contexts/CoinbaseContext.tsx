'use client';

// External Imports
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { createContext, useState, ReactNode, useEffect } from 'react';

// Internal Imports
import { appConfig } from '@/config';

const currentNetworkConfig = appConfig.networks.testnet;
const metadata = appConfig.constants.METADATA;

export const coinbaseWallet = new CoinbaseWalletSDK({
    appName: metadata.name,
    appChainIds: [Number.parseInt(currentNetworkConfig.chainId, 16)],
});
const provider = coinbaseWallet.makeWeb3Provider({ options: 'smartWalletOnly' });

const defaultValues = {
    account: '',
    connect: () => { },
    disconnect: () => { },
};

export const CoinbaseContext = createContext(defaultValues);

export const CoinbaseContextProvider = (props: { children: ReactNode | undefined }) => {
    const [account, setAccount] = useState(defaultValues.account);

    const connect = async () => {
        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
            setAccount(accounts[0]);
        } catch (error) {
            console.error('Failed to connect to Coinbase Wallet', error);
        }
    };

    const disconnect = () => {
        setAccount('');
    };

    return (
        <CoinbaseContext.Provider
            value={{
                account,
                connect,
                disconnect
            }}
        >
            {props.children}
        </CoinbaseContext.Provider>
    );
};