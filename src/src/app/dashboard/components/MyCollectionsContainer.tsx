import React from "react";
import CollectionsContainer, { CollectionCard } from "./CollectionsContainer";
import { TCollectionInfo } from "@/types";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { getMyCollections } from "@/entry-functions";
import { toast } from "react-toastify";
import { clsx } from "clsx";

export default function MyCollectionsContainer() {
    const [collections, setCollections] = React.useState<TCollectionInfo[] | []>([]);
    const { accountId } = useWalletInterface();
    const load = React.useCallback(async () => {
        try {
            const data = await getMyCollections(accountId!);
            setCollections(data);
        } catch (error: any) {
            toast.error('Failed to load my collections');
            console.error(error);
        }
    }, [accountId]);
    React.useEffect(() => {
        load()
    }, [load, accountId]);

    return (
        <section id="auctions" className='flex flex-col gap-8 h-full w-full'>
            <h1 className="text-2xl font-bold text-default-foreground flex flex-row items-center gap-4">
                Collection
            </h1>
            {
                collections.length > 0 ?
                    <div className="flex flex-col gap-4">
                        <div
                            className={clsx(
                                'grid content-start [--column-gap:12px] min-720:[--column-gap:24px] gap-x-[--column-gap] gap-y-4 min-720:gap-y-8 [--min-column-width:300px] min-720:[--min-column-width:324px] min-840:[--min-column-width:384px] [--max-column-count:5] [--total-gap-width:calc((var(--max-column-count)-1)*var(--column-gap))] [--max-column-width:calc((100%-var(--total-gap-width))/var(--max-column-count))] grid-cols-[repeat(auto-fill,minmax(max(var(--min-column-width),var(--max-column-width)),1fr))]',
                            )}
                        >
                            {collections.map((collection: TCollectionInfo, index: number) => (
                                <CollectionCard collection={collection} key={index} />
                            ))}

                        </div>
                    </div>
                    :
                    <div>
                        <p className="text-default text-base font-medium">No collection found</p>
                    </div>
            }
        </section>
    )

}