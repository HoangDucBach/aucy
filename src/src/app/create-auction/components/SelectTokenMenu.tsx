'use client';

// External imports
import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, cn, Radio, Select, SelectItem } from "@nextui-org/react";

// Internal imports
import { Button } from "@/components/ui/button";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { getMyCollections } from "@/entry-functions";
import { getNfts } from "@/entry-functions";
import { toast } from "react-toastify";

export const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;

    return (
        <Radio
            {...otherProps}
            classNames={{
                base: cn(
                    "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                ),
            }}
        >
            {children}
        </Radio>
    );
};
export function SelectTokenMenu({ onTokenSelect }: { onTokenSelect: (tokenAddress: string, tokenId: number) => void }) {
    const { accountId } = useWalletInterface();
    const [myTokens, setMyTokens] = React.useState<any>([]);
    const [nftsOfToken, setNftsOfToken] = React.useState<any>(null);
    const [selectedToken, setSelectedToken] = React.useState<any>(null);
    const [selectedTokenId, setSelectedTokenId] = React.useState<any>(null);
    const [serial, setSerial] = React.useState<any>(null);

    React.useEffect(() => {
        if (accountId) {
            getMyCollections(accountId)
                .then(data => {
                    setMyTokens(data);
                })
                .catch(err => {
                    toast.error('Failed to fetch collections');
                });
        }
    }, [accountId]);
    React.useEffect(() => {
        if (selectedTokenId) {
            getNfts(selectedTokenId)
                .then(data => {
                    setNftsOfToken(data || []);
                })
                .catch(err => {
                    toast.error(err.message);
                });
        }
    }, [selectedToken, selectedTokenId]);
    React.useEffect(() => {
        onTokenSelect(selectedTokenId, serial);
        console.log(selectedTokenId, serial);
    }, [selectedTokenId, serial]);
    return (
        <div className="flex flex-row gap-4 justify-between items-start w-full">
            <Select
                isRequired
                label="Token"
                placeholder="Choose your NFT"
                labelPlacement="outside-left"
                color="secondary"
                classNames={{
                    base: "items-center",
                    label: "font-semibold text-base"
                }}
                variant="bordered"
                fullWidth={true}
                onSelectionChange={(target) => {
                    if (target.currentKey !== undefined) {
                        setSelectedToken(myTokens[target.currentKey]);
                        setSelectedTokenId(myTokens[target.currentKey].tokenId);
                    }
                }}
            >
                {
                    myTokens.map((token: any, index: number) => {
                        return (
                            <SelectItem key={index} value={token.tokenId}>
                                {token.tokenId}
                            </SelectItem>
                        )
                    })
                }
            </Select>
            <Select
                isRequired
                placeholder="Serial"
                labelPlacement="inside"
                description="Choose serial of your NFT"
                classNames={{
                    base: "items-center w-fit",
                }}
                variant="flat"
                fullWidth={true}
                isLoading={selectedTokenId && !nftsOfToken}
                onSelectionChange={(target) => {
                    if (target.currentKey !== undefined) {
                        setSerial(nftsOfToken[target.currentKey].serialNumber);
                    }
                }}
                value={serial}
            >
                {
                    nftsOfToken && nftsOfToken.map((nft: any, index: number) => {
                        return (
                            <SelectItem key={index} value={nft.serialNumber}>
                                {nft.serialNumber}
                            </SelectItem>
                        )
                    })
                }
            </Select>
        </div>
    )
}
