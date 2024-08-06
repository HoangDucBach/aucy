'use client'
// External functions
import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Divider } from "@nextui-org/react";
import { Wallet02Icon } from 'hugeicons-react'
import { TbCopyCheckFilled } from "react-icons/tb";
import { HiLogout } from "react-icons/hi";
import { MdExplore } from "react-icons/md";

// Internal imports
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "./WalletSelectionDialog";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/address/truncate";
import { useMedia } from "@/hooks";

export function MyWalletShortcut() {
    const { accountId, walletInterface } = useWalletInterface();
    const displayAccount = truncateAddress(accountId!);
    const {isMobile} = useMedia();
    if (!accountId) return <WalletSelectionDialog />
    return (

        <Dropdown>
            <DropdownTrigger>
                <Button radius="full" isIconOnly={isMobile} startContent={<Wallet02Icon stroke="2" size={24} />} className="bg-layout-foreground-900 text-content1">
                    {isMobile ? null : displayAccount}
                </Button>
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownItem
                    key={'account'}
                    endContent={<TbCopyCheckFilled size={24} />}
                    description="Your wallet address"
                >
                    {displayAccount}
                </DropdownItem>
                <DropdownItem>
                    <Divider />
                </DropdownItem>
                <DropdownItem
                    key={'profile'}
                    endContent={<MdExplore size={24} />}
                >
                    Profile
                </DropdownItem>
                <DropdownItem
                    key={'disconnect'}
                    onClick={walletInterface.disconnect}
                    endContent={<HiLogout size={24} />}
                >
                    Disconnect Wallet
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}