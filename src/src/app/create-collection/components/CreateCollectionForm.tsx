'use client';

// External imports
import { useForm, SubmitHandler } from "react-hook-form"
import { parseZonedDateTime, parseAbsoluteToLocal } from "@internationalized/date";

// Internal imports
import { TCreateCollection } from "@/types"
import { DatePicker, Input, Textarea } from "@nextui-org/react"
import { Button } from "@/components/ui/button";

// Entry functions
import { createCollection } from "@/entry-functions";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { toast } from "react-toastify";
import React from "react";
import { AccountId, EvmAddress, PublicKey } from "@hashgraph/sdk";

export default function CreateCollectionForm() {
    const { walletInterface } = useWalletInterface();
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
            isSubmitSuccessful
        },
    } = useForm<TCreateCollection>({
        mode: 'onChange',
    })

    const onSubmit: SubmitHandler<TCreateCollection> = async (data) => {
        try {
            await createCollection(data, walletInterface);
            toast.success('Collection created successfully');
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const validateName = register('name', {
        required: true,
        minLength: {
            value: 1,
            message: 'Symbol should be at least 1 character'
        },
        maxLength: {
            value: 100,
            message: 'Name should not exceed 100 characters'
        }
    })
    const validateSymbol = register('symbol', {
        required: true,
        minLength: {
            value: 1,
            message: 'Symbol should be at least 1 character'
        },
        maxLength: {
            value: 10,
            message: 'Symbol should not exceed 10 characters'
        },
    })
    const validateDecimals = register('decimals', {
        required: true,
        min: {
            value: 0,
            message: 'Starting price should be greater than 0'
        },
    })

    const validateCustomFees = register('customFees', {
        required: false
    })
    const validateAdminKey = register('adminKey', {
        required: false
    })
    const validateKycKey = register('kycKey', {
        required: false
    })
    const validateSupplyKey = register('supplyKey', {
        required: {
            value: false,
            message: 'Supply key must be provided'
        }
    })
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-8 justify-between">
                <div className="flex flex-col gap-4 justify-between">
                    <div className="w-full flex flex-row gap-4 justify-between">
                        <Input
                            label="Name"
                            placeholder="Name of collection"
                            errorMessage={errors.name?.message}
                            isInvalid={errors.name?.message !== undefined}
                            maxLength={100}
                            labelPlacement="outside"
                            fullWidth={true}
                            classNames={{
                                label: 'font-semibold text-default-foreground',
                            }}
                            isRequired
                            {...validateName}
                        />

                        <Input
                            label="Symbol"
                            placeholder="Symbol"
                            errorMessage={errors.symbol?.message}
                            isInvalid={errors.symbol?.message !== undefined}
                            maxLength={11}
                            labelPlacement="outside"
                            classNames={{
                                label: 'font-semibold text-default-foreground',
                                mainWrapper: 'w-fit max-w-[48em]',
                                base: 'w-fit'
                            }}
                            isRequired
                            {...validateSymbol}
                        />
                    </div>

                    <div className="w-full flex flex-row justify-between gap-4">
                        <Input
                            label="Decimals"
                            placeholder="Decimals"
                            errorMessage={errors.decimals?.message}
                            isInvalid={errors.decimals?.message !== undefined}
                            defaultValue="0"
                            type="number"
                            labelPlacement="outside"
                            classNames={{
                                label: 'font-semibold text-default-foreground',
                            }}
                            isRequired={validateDecimals.required}
                            {...validateDecimals}
                        />

                        <Input
                            label="Custom Fees"
                            placeholder="Custom Fees"
                            errorMessage={errors.customFees?.message}
                            isInvalid={errors.customFees?.message !== undefined}
                            disabled={true}
                            type="number"
                            defaultValue="0"
                            labelPlacement="outside"
                            classNames={{
                                label: 'font-semibold text-default-foreground',
                            }}
                            isRequired={validateCustomFees.required}
                            {...validateCustomFees}
                        />
                    </div>
                </div>

                <h6 className="text-base font-semibold text-default-foreground">Keys</h6>
                <Input
                    label="Admin Key"
                    placeholder="Admin Key"
                    description={"The default is your public key. Support EDCSA ad ED25519 keys."}
                    labelPlacement="outside-left"
                    type="password"
                    classNames={{
                        label: 'px-2 font-semibold text-default-foreground font-semibold',
                        input: 'text-content-content4-foreground',
                        mainWrapper: 'w-full h-fit',
                    }}
                    {...validateAdminKey}
                />

                <Input
                    label="KYC Key"
                    placeholder="KYC Key"
                    labelPlacement="outside-left"
                    description={"The KYC Key is used for verifying user identities and handling Know Your Customer (KYC) compliance processes. Use EDCSA key!"}
                    type="password"
                    classNames={{
                        label: 'px-2 font-semibold text-default-foreground font-semibold',
                        input: 'text-content-content4-foreground',
                        mainWrapper: 'w-full h-fit',
                    }}
                    {...validateKycKey}
                />

                <Input
                    label="Supply Key"
                    placeholder="Supply Key"
                    description={"The default is your public key. Support EDCSA ad ED25519 keys."}
                    labelPlacement="outside-left"
                    type="password"
                    isRequired={validateSupplyKey.required}
                    classNames={{
                        label: 'px-2 font-semibold text-default-foreground font-semibold',
                        input: 'text-content-content4-foreground',
                        mainWrapper: 'w-full h-fit',
                    }}
                    {...validateSupplyKey}
                />
                <div>

                </div>
                <div className="w-fit">
                    <Button
                        variant="solid"
                        color="primary"
                        type="submit"
                        radius="full"
                        fullWidth={false}
                        isLoading={isSubmitting}
                    >
                        Create Collection
                    </Button>
                </div>
            </div>
        </form>
    )
}