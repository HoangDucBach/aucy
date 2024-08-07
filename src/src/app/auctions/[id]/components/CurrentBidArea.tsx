'use client';
// External imports
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react"

// Internal imports
import { useAuctionContext } from "../context";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { Button } from "@/components/ui/button";
import { PiGiftFill } from "react-icons/pi";
import { donate } from "@/entry-functions";
import { toast } from "react-toastify";
function DonationArea() {
    const { walletInterface } = useWalletInterface();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [donation, setDonation] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleDonate = async () => {
        try {
            setLoading(true);
            await donate(donation, walletInterface);
            toast.success('Donated successfully');
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to donate');
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Button
                variant="bordered"
                color="primary"
                radius="full"
                size="md"
                className="bg-white/5"
                onClick={onOpen}
                endContent={
                    <PiGiftFill size={24} className="text-primary" />
                }
            >
                Donate
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onOpenChange}
                size="sm"
                classNames={{
                    base: 'border border-default/50 rounded-[32px] bg-layout-foreground-50',
                }}
            >
                <ModalContent className="items-center">
                    <ModalHeader className="flex flex-col items-center gap-2">
                        <h6>Donate</h6>
                        <p className="text-base font-normal text-default">Donate a fee to this auction as a gift!</p>
                    </ModalHeader>
                    <ModalBody className="flex flex-row justify-between gap-2 items-center">
                        <Input
                            radius="full"
                            type="number"
                            labelPlacement="outside"
                            classNames={{
                                label: 'font-semibold text-default-foreground',
                                mainWrapper: 'w-fit max-w-[48em]',
                                base: 'w-fit',
                                input: 'text-4xl font-bold !text-default-500',
                            }}
                            endContent={
                                <img
                                    src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                                    alt='hbar logo'
                                    className='w-8 h-8'
                                />
                            }
                            isRequired
                            defaultValue="0"
                            onChange={(e) => setDonation(Number(e.target.value))}
                            min={0}
                        />
                        <Button
                            variant="bordered"
                            isIconOnly
                            color="primary"
                            radius="full"
                            size="md"
                            className="bg-white/5"
                            isLoading={loading}
                            onClick={handleDonate}
                            endContent={
                                <PiGiftFill size={24} className="text-primary" />
                            }
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
export function CurrentBidArea() {
    const auction = useAuctionContext();
    const [currentBid, setCurrentBid] = React.useState<number>(0);

    React.useEffect(() => {
        setCurrentBid(Number(auction?.highestBid?.toString()));
    }, [auction]);

    return (
        <section id="current-bid" className="w-full h-fit p-4 bg-layout-foreground-50 rounded-[32px] border border-default">
            <div className="w-full flex justify-between gap-4 items-center">
                <div className="flex flex-col gap-2">
                    <h6 className="text-base text-default font-medium">Current Bid</h6>
                    <div className="rounded-full px-4 py-1 bg-layout-foreground-100 border-default flex flex-row gap-2 justify-between items-center w-fit h-fit">
                        <p className="text-2xl font-bold !text-default-500">{currentBid}</p>
                        <img
                            src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                            alt='hbar logo'
                            className='w-8 h-8'
                        />
                    </div>
                </div>
                <DonationArea />
            </div>

        </section>

    )
}