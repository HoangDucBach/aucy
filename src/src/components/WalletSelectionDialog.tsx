'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider } from "@nextui-org/react";
import { FaWallet } from "react-icons/fa";

// Internal imports
import { Button } from "@/components/ui/button";
import { Image } from "@nextui-org/react";
import { useMedia } from "@/hooks";
import { openWalletConnectModal } from "@/services/wallets/walletconnect/walletConnectClient";
import { connectToMetamask } from "@/services/wallets/metamask/metamaskClient";

interface WalletSelectionDialogProps {
    open?: boolean;
    setOpen?: (value: boolean) => void;
    onClose?: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isMobile } = useMedia();
    return (
        <>
            <Button
                onClick={onOpen}
                variant="solid"
                color="primary"
                radius="full"
                isIconOnly={isMobile}
                startContent={<FaWallet size={16} />}
            >
                {isMobile ? null : 'Connect Wallet'}
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
                            <Image
                                src={'/assets/walletconnect-logo.svg'}
                                alt='walletconnect logo'
                                width={32}
                                height={32}
                            />
                        </Button>
                        <Button
                            variant="solid"
                            fullWidth
                            onClick={() => {
                                connectToMetamask()
                            }}
                        >
                            MetaMask
                            <Image
                                src={'/assets/metamask-logo.svg'}
                                alt='metamask logo'
                                width={32}
                                height={32}
                            />
                        </Button>
                        <Divider />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}