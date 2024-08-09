'use client';

// External imports
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { useEffect, useState } from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";

// Internal imports
import { TAuctionCreation } from "@/types"
import { DatePicker, Input, Modal, Textarea, ModalHeader, ModalContent, ModalFooter, useDisclosure, ModalBody } from "@nextui-org/react"
import { Button } from "@/components/ui/button";

// Entry functions
import { createAuction } from "@/entry-functions";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { SelectTokenMenu } from "./SelectTokenMenu";
import { toast } from "react-toastify";
import { Image } from "@nextui-org/react";

export default function CreateAuctionForm() {
    const { walletInterface } = useWalletInterface();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState<TAuctionCreation | null>(null);
    const [tokenId, setTokenId] = useState<number | null>(null);
    const [tokenAddress, setTokenAddress] = useState<string | null>(null);
    const [receivers, setReceivers] = useState<string[]>([]);
    const [percentages, setPercentages] = useState<number[]>([]);
    const [newReceiver, setNewReceiver] = useState<string>('');
    const [newPercentage, setNewPercentage] = useState<number>(0);

    const {
        control,
        register,
        handleSubmit,
        formState: {
            isSubmitting,
        }
    } = useForm<TAuctionCreation>({
        mode: 'onBlur',
    })

    const onSubmit: SubmitHandler<TAuctionCreation> = async (data) => {
        setData(data);
        onOpen();
        try {
            await createAuction({
                name: data.name,
                description: data.description,
                tokenId: tokenId!,
                tokenAddress: tokenAddress!,
                startingPrice: data.startingPrice,
                minBidIncrement: data.minBidIncrement,
                endingPrice: data.endingPrice,
                endingAt: data.endingAt,
                receivers: receivers,
                percentages: percentages,
            }, walletInterface);
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to create auction');
        }
    }

    const validateName = register('name', {
        required: true,
        maxLength: {
            value: 100,
            message: 'Name should not exceed 100 characters'
        }
    })
    const validateDescription = register('description', {
        required: true,
        maxLength: {
            value: 1000,
            message: 'Description should not exceed 1000 characters'
        },
    })
    const validateStartingPrice = register('startingPrice', {
        required: true,
        min: {
            value: 0,
            message: 'Starting price should be greater than 0'
        },
    })
    const validateEndingPrice = register('endingPrice', { required: false })
    const validateMinBidIncrement = register('minBidIncrement', { required: false })
    const validateEndingAt = register('endingAt', { required: true })

    const addReceiver = () => {
        const totalPercentage = percentages.reduce((acc, curr) => acc + curr, 0);
        if (totalPercentage + newPercentage > 100) {
            toast.error('Total percentage cannot exceed 100%');
            return;
        }
        if (newReceiver && newPercentage > 0) {
            setReceivers([...receivers, newReceiver]);
            setPercentages([...percentages, newPercentage]);
            setNewReceiver('');
            setNewPercentage(0);
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-8 justify-between">
                    <SelectTokenMenu onTokenSelect={(address: string, id: number) => {
                        setTokenId(id);
                        setTokenAddress(address);
                    }} />
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Name"
                            placeholder="Name"
                            labelPlacement="outside"
                            classNames={{
                                label: 'font-semibold text-default-foreground',
                            }}
                            isRequired
                            {...validateName}
                        />

                        <Textarea
                            label="Description"
                            placeholder="Description"
                            labelPlacement="outside"
                            classNames={{
                                label: 'font-semibold text-default-foreground',
                            }}
                            isRequired
                            {...validateDescription}
                        />
                        <div className="w-full flex flex-col md:flex-row justify-between gap-8">
                            <Input
                                label="Starting Price"
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
                                        width={32}
                                        height={32}
                                    />
                                }
                                isRequired
                                defaultValue="0"
                                min={0}
                                {...validateStartingPrice}
                            />
                            <Input
                                label="Min Bid Increment"
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
                                        width={32}
                                        height={32}
                                    />
                                }
                                isRequired={validateMinBidIncrement.required}
                                defaultValue="0"
                                min={0}
                                {...validateMinBidIncrement}
                            />
                            <Input
                                label="Ending Price"
                                radius="full"
                                type="number"
                                labelPlacement="outside"
                                description="The final price at which an item is sold in an auction"
                                classNames={{
                                    label: 'font-semibold text-default-foreground',
                                    mainWrapper: 'w-fit max-w-[48em]',
                                    base: 'w-fit',
                                    input: 'text-4xl font-bold !text-default-500',
                                }}
                                defaultValue="0"
                                min={0}
                                endContent={
                                    <Image
                                        src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                                        alt='hbar logo'
                                        className='w-8 h-8'
                                        width={32}
                                        height={32}
                                    />
                                }
                                {...validateEndingPrice}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-default-foreground">Receivers</h3>
                        <div className="flex flex-row items-end gap-4 w-full">
                            <Input
                                label="Receiver Address"
                                placeholder="Receiver Address"
                                labelPlacement="outside"
                                classNames={{
                                    label: 'font-semibold text-default-foreground',
                                }}
                                value={newReceiver}
                                onChange={(e) => setNewReceiver(e.target.value)}
                            />
                            <Input
                                label="Percentage"
                                type="number"
                                placeholder="Percentage"
                                labelPlacement="outside"
                                classNames={{
                                    label: 'font-semibold text-default-foreground',
                                }}
                                onChange={(e) => setNewPercentage(Number(e.target.value))}
                            />
                            <Button
                                variant="solid"
                                color="primary"
                                onClick={addReceiver}
                            >
                                Add
                            </Button>
                        </div>
                        <div>
                            {receivers.map((receiver, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>{receiver}</span>
                                    <span className="text-secondary">{percentages[index]}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Controller
                        control={control}
                        {...validateEndingAt}
                        render={({ field }) => (
                            <DatePicker
                                label={"Event date"}
                                defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
                                isRequired
                                classNames={{
                                    label: 'font-semibold text-default-foreground',
                                }}
                                labelPlacement="outside"
                                onChange={(date) => {
                                    field.onChange(date.toDate().getTime());
                                }}
                                ref={field.ref}
                            />
                        )}
                    />
                    <div className="w-fit">
                        <Button
                            variant="solid"
                            color="primary"
                            type="submit"
                            radius="full"
                            fullWidth={false}
                            isLoading={isSubmitting}
                        >
                            Create Auction
                        </Button>
                    </div>
                </div>
            </form>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-2xl font-bold text-default-foreground">Auction Created</h2>
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-lg text-default-foreground">Your auction has been created successfully</p>
                        {data && (
                            <div>
                                <p className="text-lg text-default-foreground">Auction ID: {data.name}</p>
                                <p className="text-lg text-default-foreground">Name: {data.name}</p>
                                <p className="text-lg text-default-foreground">Description: {data.description}</p>
                                <p className="text-lg text-default-foreground">Token Address: {tokenAddress}</p>
                                <p className="text-lg text-default-foreground">Token ID: {tokenId}</p>
                                <p className="text-lg text-default-foreground">Starting Price: {data.startingPrice}</p>
                                <p className="text-lg text-default-foreground">Ending Price: {data.endingPrice}</p>
                                <p className="text-lg text-default-foreground">Min Bid Increment: {data.minBidIncrement}</p>
                                <p className="text-lg text-default-foreground">Ending At: {data.endingAt}</p>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="solid"
                            color="primary"
                            radius="full"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}