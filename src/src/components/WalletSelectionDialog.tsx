import { Button, Dialog, Stack } from "@mui/material";
import { connectToMetamask } from "@/services/wallets/metamask/metamaskClient";
import { openWalletConnectModal } from "@/services/wallets/walletconnect/walletConnectClient";
import WalletConnectLogo from "../../public/assets/walletconnect-logo.svg";


interface WalletSelectionDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
  const { onClose, open, setOpen } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <Stack p={2} gap={1}>
        <Button
          variant="contained"
          onClick={() => {
            openWalletConnectModal()
            setOpen(false);
          }}
        >
          <img
            src={window.location.origin + '/assets/walletconnect-logo.svg'}
            alt='walletconnect logo'
            className='w-8 h-8'
          />
          WalletConnect
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            connectToMetamask();
          }}
        >
          <img
            src={window.location.origin + '/assets/metamask-logo.svg'}
            alt='metamask logo'
            className='w-8 h-8'
          />
          Metamask
        </Button>
      </Stack>
    </Dialog>
  );
}