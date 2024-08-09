'use client';
// External imports
import React from "react";

// Internal imports
import { useAuctionContext } from "../context";
import { getMetadata, getNftInfo } from "@/entry-functions";
import { toast } from "react-toastify";
import { Image } from "@nextui-org/react";

export function NftImageArea() {
    const auction = useAuctionContext();
    const [nft, setNft] = React.useState<any>(null);
    const [metadata, setMetadata] = React.useState<any>(null);
    const load = React.useCallback(async () => {
        try {
            if (!auction) return;
            if (!auction.tokenAddress || !auction.tokenId) return;
            const nft = await getNftInfo(auction?.tokenAddress, auction?.tokenId);
            setNft(nft);
            const metadata = await getMetadata(nft.metadata);
            setMetadata(metadata);
        } catch (error: any) {
            toast.error(error.message);
            console.error(error);
        }
    }, [auction]);

    React.useEffect(() => {
        load();
    }, [auction, load]);

    return (
        <Image
            classNames={{
                img: "h-[75vh] aspect-square object-cover rounded-[32px]",
                wrapper : "h-[75vh] aspect-square object-cover rounded-[32px]",
                blurredImg: "h-[75vh] aspect-square object-cover rounded-[32px]",
            }}
            sizes="500"
            isLoading={!metadata}
            src={metadata?.image}
            alt={metadata?.name}
        />
    )
}