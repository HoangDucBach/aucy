'use client';
// External imports
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react"
import { TbPigMoney } from "react-icons/tb";
import { PiGiftFill } from "react-icons/pi";
import { PiHandWithdrawBold } from "react-icons/pi";
import { Image } from "@nextui-org/react";

// Internal imports
import { useAuctionContext } from "../context";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { Button } from "@/components/ui/button";
import { donate } from "@/entry-functions";
import { toast } from "react-toastify";
import { placeBid, withdrawBid } from "@/entry-functions";
import { AuctionDonationError } from "@/types";

function DonationArea() {
    const { walletInterface } = useWalletInterface();
    const auction = useAuctionContext();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [donation, setDonation] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleDonate = async () => {
        try {
            setLoading(true);
            console.log('donation', donation);
            await donate(auction?.id!, donation, walletInterface);
            toast.success('Donated successfully');
            onClose();
        } catch (error: any) {
            if(error instanceof AuctionDonationError) toast.error(error.message);
            if(error instanceof Error) toast.error(error.message);
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
                                <Image
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
                        >
                            <PiGiftFill size={24} className="text-primary" />
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
function BidArea() {
    const { walletInterface } = useWalletInterface();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [bidValue, setBidValue] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const auction = useAuctionContext();

    const handleBid = async () => {
        try {
            setLoading(true);
            await placeBid(auction?.id!, bidValue, walletInterface);
            toast.success('Bidded successfully');
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to bid');
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Button
                color="primary"
                radius="full"
                size="md"
                onClick={onOpen}
            >
                Place a bid
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onOpenChange}
                size="sm"
                classNames={{
                    base: 'border border-default/50 bg-layout-foreground-50',
                }}
            >
                <ModalContent className="items-center">
                    <ModalHeader className="flex flex-col items-center gap-2">
                        <h6>Place a bid</h6>
                        <p className="text-base font-normal text-default text-center">Bid value must be greater than current bid</p>
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
                                <Image
                                    src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                                    alt='hbar logo'
                                    className='w-8 h-8'
                                />
                            }
                            isRequired
                            defaultValue="0"
                            onChange={(e) => setBidValue(Number(e.target.value))}
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
                            onClick={handleBid}
                        >
                            <TbPigMoney size={24} className="text-primary" />
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
function WithdrawBidArea() {
    const { walletInterface } = useWalletInterface();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isAgreed, setIsAgreed] = React.useState<boolean>(false);
    const auction = useAuctionContext();

    const handleWithdrawBid = async () => {
        try {
            setLoading(true);
            await withdrawBid(auction?.id!, walletInterface);
            toast.success('Bid withdrawn successfully');
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to withdraw bid');
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Button
                variant="solid"
                color="danger"
                radius="full"
                size="md"
                onClick={onOpen}
            >
                Withdraw bid
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onOpenChange}
                size="sm"
                classNames={{
                    base: 'border border-default/50 bg-layout-foreground-50',
                }}
            >
                <ModalContent className="items-center">
                    <ModalHeader className="flex flex-col items-start gap-2">
                        <h6>Withdraw Bid</h6>
                        <p className="text-sm font-normal text-default-foreground">Confirm that you want to withdraw!</p>
                        <p className="text-sm font-normal text-default-foreground">
                            Notice that you can only withdraw your bid if you are the highest bidder
                        </p>
                    </ModalHeader>
                    <ModalBody className="flex flex-row justify-between gap-2 items-center">
                    </ModalBody>
                    <ModalFooter className="flex flex-row items-center justify-end gap-4 w-full">
                        <Button
                            variant="light"
                            color="default"
                            radius="full"
                            size="md"
                            onClick={onClose}
                            isLoading={loading}
                            onPress={() => setIsAgreed(false)}
                            autoFocus
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            color="success"
                            radius="full"
                            size="md"
                            onPress={handleWithdrawBid}
                            isLoading={loading}
                            endContent={
                                <PiHandWithdrawBold size={24} />
                            }
                        >
                            I Agree
                        </Button>
                    </ModalFooter>
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
                        <Image
                            src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                            alt='hbar logo'
                            className='w-8 h-8'
                        />
                    </div>
                </div>
                <div className="flex flex-row items-center gap-4 w-fit">
                    <DonationArea />
                    <WithdrawBidArea />
                    <BidArea />
                </div>
            </div>

        </section>

    )
}