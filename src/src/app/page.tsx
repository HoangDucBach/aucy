'use client';

// External imports
import React, {useState} from 'react';

// Internal imports
import {createNFT} from '@/entry-functions/create-nft';
import NavBar from "@/components/Navbar";
import {AllWalletsProvider} from "@/services/wallets/AllWalletsProvider";
import { useWalletInterface } from '@/services/wallets/useWalletInterface';
import {HEDERA_PRIVATE_KEY, METAMASK_GAS_LIMIT_ASSOCIATE} from "@/config/constants";

const CreateNFTForm = () => {
    const [tokenInfo, setTokenInfo] = useState<any>();
    const {walletInterface, accountId} = useWalletInterface();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setTokenInfo({
            ...tokenInfo,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tokenInfo) {
            alert('Please fill in all fields.');
            return;
        }
        try {
            await createNFT(tokenInfo, walletInterface, accountId!);
            alert('NFT created successfully! at');
        } catch (error) {
            console.error('Error creating NFT:', error);
            alert('Failed to create NFT.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange}/>
            <input type="text" name="symbol" placeholder="Symbol" onChange={handleChange}/>
            <input type="number" name="decimals" placeholder="Decimals" onChange={handleChange}/>
            <input type="text" name="adminKey" placeholder="Admin Key" onChange={handleChange}/>
            <input type="text" name="kycKey" placeholder="KYC Key" onChange={handleChange}/>
            <input type="text" name="freezeKey" placeholder="Freeze Key" onChange={handleChange}/>
            <input type="text" name="supplyKey" placeholder="Supply Key" onChange={handleChange}/>
            <input type="text" name="customFees" placeholder="Custom Fees" onChange={handleChange}/>
            <input type="number" name="maxSupply" placeholder="Max Supply" onChange={handleChange}/>
            <button type="submit">Create NFT</button>
        </form>
    );
};

export default function Home() {
    return (
        <AllWalletsProvider>
            <NavBar/>
            <CreateNFTForm/>
        </AllWalletsProvider>
    );
}
