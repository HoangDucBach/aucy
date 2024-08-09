'use client';

import { TAuction } from "@/types";
import { AuctionContextProvider, AuctionContext } from "../context";
import { NftImageArea } from "./NftImageArea";
import { HeaderArea } from "./HeaderArea";
import { CountdownArea } from "./CountdownArea";
import { CurrentBidArea } from "./CurrentBidArea";
import { useMedia } from "@/hooks";
import DetailsArea from "./DetailsArea";
import ReceiversArea from "./ReceiversArea";

export function Provider(auction: TAuction) {
    const { isMobile } = useMedia();
    if (isMobile) {
        return (
            <AuctionContextProvider>
                <AuctionContext.Provider value={auction}>
                    <div className="flex flex-col items-center justify-start gap-8 h-full">
                        <HeaderArea />
                        <NftImageArea />
                        <CountdownArea />
                        <CurrentBidArea />
                    </div>
                </AuctionContext.Provider>
            </AuctionContextProvider>
        );
    }
    return (
        <AuctionContextProvider>
            <AuctionContext.Provider value={auction}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                    <NftImageArea />
                    <div className="md:py-8 h-full w-full flex flex-col items-center justify-between gap-4">
                        <HeaderArea />
                        <DetailsArea />
                        <ReceiversArea />
                        <CountdownArea />
                        <CurrentBidArea />
                    </div>
                </div>
            </AuctionContext.Provider>
        </AuctionContextProvider>
    );
}