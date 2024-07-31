'use client';

import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useWalletInterface } from '@/services/wallets/useWalletInterface';
import { WalletSelectionDialog } from './WalletSelectionDialog';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId])

  return (
    <AppBar position='relative'>
      <Toolbar>
        <Typography variant="h6" color="white" pl={1} noWrap>
          Happy Building
        </Typography>
        <Button
          variant='contained'
          sx={{
            ml: "auto"
          }}
          onClick={handleConnect}
        >
          {accountId ? `Connected: ${accountId}` : 'Connect Wallet'}
        </Button>
      </Toolbar>
      <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
    </AppBar>
  )
}