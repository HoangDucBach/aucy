import { useContext } from "react"
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletConnectWallet, walletConnectWallet } from "./walletconnect/walletConnectClient";

// Purpose: This hook is used to determine which wallet interface to use
// Example: const { accountId, walletInterface } = useWalletInterface();
// Returns: { accountId: string | null, walletInterface: WalletInterface | null }
type TWalletInterface = {
    accountId: string | null;
    walletInterface: WalletConnectWallet;
}
export const useWalletInterface = (): TWalletInterface => {
    const walletConnectCtx = useContext(WalletConnectContext);
    return {
        accountId: walletConnectCtx.accountId,
        walletInterface: walletConnectWallet, 
    };
}