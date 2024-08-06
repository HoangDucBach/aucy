'use client';
import { openWalletConnectModal } from "@/services/wallets/walletconnect/walletConnectClient";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider } from "@nextui-org/react";

// Internal imports
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface WalletSelectionDialogProps {
    open?: boolean;
    setOpen?: (value: boolean) => void;
    onClose?: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <Button
                onClick={onOpen}
                variant="solid"
                color="primary"
                radius="full"
            >
                Connect Wallet
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={true}
                size="xs"
                placement="center"
            >

                <ModalContent>
                    <ModalHeader className="flex flex-row gap-4 items-center">
                        <Image src='/aucy.svg' alt="Aucy" width={24} height={24} />
                        Connect to Aucy
                    </ModalHeader>
                    <ModalBody>
                        <Button
                            variant="solid"
                            fullWidth
                            onClick={() => {
                                openWalletConnectModal()
                            }}
                        >
                            WalletConnect
                            <img
                                src={'/assets/walletconnect-logo.svg'}
                                alt='walletconnect logo'
                                className='w-8 h-8'
                            />
                        </Button>
                        <Divider />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}