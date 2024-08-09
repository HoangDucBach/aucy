import { ReactNode } from "react"
import { WalletConnectContextProvider, MetamaskContextProvider } from "@/contexts"
import { WalletConnectClient } from "./walletconnect/walletConnectClient"
import { MetaMaskClient } from "./metamask/metamaskClient"

export const AllWalletsProvider = (props: {
    children: ReactNode | undefined
}) => {
    return (
        <WalletConnectContextProvider>
            <MetamaskContextProvider>
                <MetaMaskClient />
                <WalletConnectClient />
                {props.children}
            </MetamaskContextProvider>
        </WalletConnectContextProvider>
    )
}