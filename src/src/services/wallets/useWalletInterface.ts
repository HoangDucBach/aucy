import { useContext } from "react"
import { MetamaskContext } from "@/contexts/MetamaskContext";
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { metamaskWallet } from "./metamask/metamaskClient";
import { walletConnectWallet } from "./walletconnect/walletConnectClient";
import {WalletInterface} from "@/services/helpers/walletInterfaces";
import {PublicKey} from "@hashgraph/sdk";

// Purpose: This hook is used to determine which wallet interface to use
// Example: const { accountId, walletInterface } = useWalletInterface();
// Returns: { accountId: string | null, walletInterface: WalletInterface | null }
type TWalletInterface<T extends WalletInterface> = {
    accountId: string | null;
    walletInterface: T | null;
}
export const useWalletInterface = (): TWalletInterface<any> => {
    const metamaskCtx = useContext(MetamaskContext);
    const walletConnectCtx = useContext(WalletConnectContext);

    if (metamaskCtx.metamaskAccountAddress) {
        return {
            accountId: metamaskCtx.metamaskAccountAddress,
            walletInterface: metamaskWallet,
        } satisfies TWalletInterface<typeof metamaskWallet>;
    } else if (walletConnectCtx.accountId) {
        return {
            accountId: walletConnectCtx.accountId,
            walletInterface: walletConnectWallet,
        } satisfies TWalletInterface<typeof walletConnectWallet>;
    } else {
        return {
            accountId: null,
            walletInterface: null,
        };
    }
}