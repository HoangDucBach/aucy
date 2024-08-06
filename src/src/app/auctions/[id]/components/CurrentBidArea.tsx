'use client';
// External imports
import React from "react";

// Internal imports
import { useAuctionContext } from "../context";
export function CurrentBidArea() {
    const auction = useAuctionContext();
    const [currentBid, setCurrentBid] = React.useState<number>(0);

    React.useEffect(() => {
        setCurrentBid(Number(auction?.highestBid?.toString()));
    }, [auction]);

    return (
        <section id="current-bid" className="w-full h-fit p-4 bg-layout-foreground-50 rounded-[32px] border border-default">
            <div className="flex flex-col gap-2">
                <h6 className="text-base text-default font-medium">Current Bid</h6>
                <div className="rounded-full px-4 py-2 bg-layout-foreground-100 border-default flex flex-row gap-2 justify-between items-center w-fit">
                    <p className="text-4xl font-bold !text-default-500">{currentBid}</p>
                    <img
                        src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                        alt='hbar logo'
                        className='w-8 h-8'
                    />
                </div>
            </div>
        </section>

    )
}