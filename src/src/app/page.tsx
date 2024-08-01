'use client';
// External imports
import React, { useEffect, useState } from 'react';

// Internal imports
import NavBar from "@/components/Navbar";
import { AllWalletsProvider } from "@/services/wallets/AllWalletsProvider";
import { createAuction } from '@/entry-functions'; // Import hàm createAuction
import { TAuctionCreation } from '@/types';
import { useWalletInterface } from '@/services/wallets/useWalletInterface';

const Form = () => {
    const { accountId, walletInterface } = useWalletInterface();

    // State để quản lý dữ liệu form
    const [auctionData, setAuctionData] = useState({
        tokenId: '',
        startingPrice: '',
        endingPrice: '',
        bidPeriod: '',
        duration: ''
    });

    // Hàm xử lý khi form được submit
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const auction = {
            tokenId: auctionData.tokenId,
            startingPrice: parseInt(auctionData.startingPrice),
            endingPrice: parseInt(auctionData.endingPrice),
            bidPeriod: parseInt(auctionData.bidPeriod),
            duration: parseInt(auctionData.duration)
        } satisfies TAuctionCreation;
        try {
            const result = await createAuction(auction, walletInterface);
            console.log('Auction created:', result);
        } catch (error) {
            console.error('Error creating auction:', error);
        }
    };

    // Hàm xử lý khi dữ liệu form thay đổi
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setAuctionData({
            ...auctionData,
            [name]: value
        });
    };
    useEffect(() => {
        console.log('Account ID:', accountId);
    }, [accountId]);
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Token ID:</label>
                    <input type="text" name="tokenId" value={auctionData.tokenId} onChange={handleChange} required />
                </div>
                <div>
                    <label>Starting Price:</label>
                    <input type="number" name="startingPrice" value={auctionData.startingPrice} onChange={handleChange} required />
                </div>
                <div>
                    <label>Ending Price:</label>
                    <input type="number" name="endingPrice" value={auctionData.endingPrice} onChange={handleChange} required />
                </div>
                <div>
                    <label>Bid Period:</label>
                    <input type="number" name="bidPeriod" value={auctionData.bidPeriod} onChange={handleChange} required />
                </div>
                <div>
                    <label>Duration:</label>
                    <input type="number" name="duration" value={auctionData.duration} onChange={handleChange} required />
                </div>
                <button type="submit">Create Auction</button>
            </form>
        </div>
    )
}
export default function Home() {



    return (
        <AllWalletsProvider>
            <Form/>
            <NavBar />
        </AllWalletsProvider>
    );
}