'use client';

// External imports
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { BsFiletypeJson } from "react-icons/bs";

// Internal imports
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { mintNFT } from "@/entry-functions";
import { useCollection } from "../context";
import { AccountId, PublicKey } from "@hashgraph/sdk";

export function Mint() {
    const { walletInterface } = useWalletInterface();
    const collection = useCollection();
    
    const [amount, setAmount] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [metadata, setMetadata] = React.useState<any>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    setMetadata(json);
                    console.log('metadata', json);
                } catch (error) {
                    toast.error("Invalid JSON file");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleMint = async () => {
        try {
            setLoading(true);
            await mintNFT({
                tokenId: collection.tokenId,
                amount: amount
            }, walletInterface, metadata);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col gap-8 w-full">
            <Input
                isRequired
                type="file"
                accept=".json"
                description="Upload metadata file"
                variant="bordered"
                radius="full"
                color="secondary"
                onChange={handleFileChange}
                endContent={<BsFiletypeJson size={24} />}
            />
            <Button color="primary" radius="full" size="md" onClick={handleMint} isLoading={loading}>Mint</Button>
        </div>
    );
}