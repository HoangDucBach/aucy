import { useContext } from "react"
import { WalletConnectContext, MetamaskContext } from "@/contexts";
import { WalletConnectWallet, walletConnectWallet } from "./walletconnect/walletConnectClient";
import { metamaskWallet, MetaMaskWallet } from "./metamask/metamaskClient";

// Purpose: This hook is used to determine which wallet interface to use
// Example: const { accountId, walletInterface } = useWalletInterface();
// Returns: { accountId: string | null, walletInterface: WalletInterface | null }
type TWalletInterface = {
    accountId: string | null;
    walletInterface: WalletConnectWallet | MetaMaskWallet;
}
export const useWalletInterface = (): TWalletInterface => {
    const walletConnectCtx = useContext(WalletConnectContext);
    const metamaskCtx = useContext(MetamaskContext);
    if(walletConnectCtx.isConnected) {
        return {
            accountId: walletConnectCtx.accountId,
            walletInterface: walletConnectWallet
        }
    }
    if(metamaskCtx.metamaskAccountAddress) {
        return {
            accountId: metamaskCtx.metamaskAccountAddress,
            walletInterface: metamaskWallet
        }
    }
    return {
        accountId: null,
        walletInterface: metamaskWallet
    }
}