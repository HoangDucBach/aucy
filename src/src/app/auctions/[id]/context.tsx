'use client';

import { TAuction } from "@/types";
import React, { useState } from "react";

const initialAuctionState: TAuction | null = null;

export const AuctionContext = React.createContext<TAuction | null>(initialAuctionState);

export const AuctionContextProvider = (props: { children: React.ReactNode }) => {
    const [auction, setAuction] = useState<TAuction | null>(initialAuctionState);

    return (
        <AuctionContext.Provider value={auction}>
            {props.children}
        </AuctionContext.Provider>
    );
};

export const useAuctionContext = () => {
    return React.useContext(AuctionContext);
};