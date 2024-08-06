import { TokenCard } from "./TokenCard";
import { useCollection } from "../context";
import { getNfts } from "@/entry-functions";
import { useEffect, useState } from "react";
import clsx from "clsx";

export function NftsContainer() {
    const collection = useCollection();
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadNfts = async () => {
            try {
                const nfts = await getNfts(collection.tokenId);
                setNfts(nfts);
            } catch (error: any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadNfts();
    }, [collection]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full w-full flex flex-col gap-4 text-2xl font-bold text-default-foreground">
            <h6 className="text-2xl font-semobold text-default-foreground">Tokens</h6>
            {
                nfts.length === 0 && <div className="w-full h-full flex items-center justify-center">
                    <p className="text-base text-default">No tokens</p>
                </div>
            }
            <div className={clsx([
                'grid content-start [--column-gap:12px] min-720:[--column-gap:24px] gap-x-[--column-gap] gap-y-4 min-720:gap-y-8 [--min-column-width:300px] min-720:[--min-column-width:324px] min-840:[--min-column-width:384px] [--max-column-count:5] [--total-gap-width:calc((var(--max-column-count)-1)*var(--column-gap))] [--max-column-width:calc((100%-var(--total-gap-width))/var(--max-column-count))] grid-cols-[repeat(auto-fill,minmax(max(var(--min-column-width),var(--max-column-width)),1fr))]',
                'w-full'
            ])}>
                {nfts && nfts.map((nft: any, index: number) => (
                    <TokenCard token={nft} key={index} />
                ))}
            </div>
        </div>
    );
}