'use client';
// External imports
import React from "react";

// Internal imports
import { useAuctionContext } from "../context";
import { getMetadata, getNftInfo } from "@/entry-functions";
import { toast } from "react-toastify";

export function NftImageArea() {
    const auction = useAuctionContext();
    const [nft, setNft] = React.useState<any>(null);
    const [metadata, setMetadata] = React.useState<any>(null);
    console.log(auction)
    const load = async () => {
        try {
            if(!auction) return;
            if(!auction.tokenAddress || !auction.tokenId) return;
            const nft = await getNftInfo(auction?.tokenAddress, auction?.tokenId);
            setNft(nft)
            const metadata = await getMetadata(nft.metadata);
            setMetadata(metadata);
        } catch (error: any) {
            toast.error(error.message)
            console.error(error)
        }
    }
    React.useEffect(() => {
        load()
    }, [auction]);

    return (
        <img
            src={metadata?.image}
            alt={metadata?.name}
            className="h-[75vh] aspect-square object-cover rounded-[32px]"
        />
    )
}