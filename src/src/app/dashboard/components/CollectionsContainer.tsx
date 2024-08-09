// External imports
import React from "react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import clsx from "clsx";

// Internal imports
import { getCollections, getMetadata } from "@/entry-functions";
import { TCollectionInfo } from "@/types";
import { Spinner, Image, Chip } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { truncateAddress } from "@/lib/address/truncate";
import { useSearchParams, useRouter } from "next/navigation";
import { trim } from "validator";
export function CollectionCard({ collection }: { collection: TCollectionInfo }) {
    const [metadata, setMetadata] = React.useState<any>(null);
    const router =useRouter();

    const load = React.useCallback(async () => {
        try {
            const metadata = await getMetadata(collection.metadata);
            setMetadata(metadata);
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to load metadata');
        }
    }, [collection.metadata]);
    
    React.useEffect(() => {
        load();
    }, [collection.metadata, load]);
    return (
        <div
            key={collection.name}
            className={clsx(
                'flex flex-col gap-4 h-fit w-full max-w-[360px]',
                "bg-layout-foreground-100 p-4 rounded-[20px]",
                "cursor-pointer"
            )}
            onClick={() => router.push(`../collections/${collection.tokenId}`)}
        >
            <Image
                isLoading={!metadata}
                width={360}
                height={360}
                src={metadata?.image}
                alt={metadata?.name}
                classNames={{
                    img: "w-full aspect-square object-cover rounded-[20px]",
                }}
            />
            <div className={clsx(
                "flex flex-row items-center justify-between h-fit w-full",
            )}>
                <h1 className="text-base font-medium text-default-foreground w-full break-words">{collection?.name}</h1>
            </div>
            <Chip
                color={'default'}
                radius="full"
            >
                {truncateAddress(collection?.tokenId.toString())}
            </Chip>
        </div>
    )
}

export default function CollectionsContainer() {
    const [collections, setCollections] = React.useState<TCollectionInfo[] | []>([]);
    const [lastId, setLastId] = React.useState<string | null>('0.0.0');
    const [hasMore, setHasMore] = React.useState<boolean>(false);
    const searchParams = useSearchParams();

    const load = React.useCallback(async () => {
        try {
            const data = await getCollections();
            setCollections(data);
        } catch (error: any) {
            toast.error('Failed to load collections');
            console.error(error);
        }
    }, []);
    const search = React.useCallback(async () => {
        const searchKey = searchParams.get('search');
        try {
            const data = await getCollections({
                'token.id': trim(searchKey || 'gt:0.0.0'),
            });
            setCollections(data);
        } catch (error: any) {
            console.error(error);
        }
    }, [searchParams]);

    const loadMore = async () => {
        try {
            setHasMore(true);
            const data = await getCollections({
                'token.id': `gt:${lastId}`
            });
            setCollections([...collections, ...data]);
            if (data.length > 0) {
                setLastId(data[data.length - 1].tokenId.toString());
            } else {
                setHasMore(false);
            }
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to load more collections');
        } finally {
            setHasMore(false);
        }
    }
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        onLoadMore: async () => {
            await loadMore();
        },
        shouldUseLoader: false,
    });
    React.useEffect(() => {
        load()
    }, [load]);
    React.useEffect(() => {
        search()
    }, [searchParams, search]);

    return (
        <section id="auctions" className='flex flex-col gap-8 h-full w-full' ref={scrollerRef}>
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
                        {hasMore && <Spinner label="Loading ..." color="primary" labelColor="primary" />}
                        <Button onClick={loadMore}>Load More</Button>
                    </div>
                    :
                    <div>
                        <p className="text-default text-base font-medium">No collection found</p>
                    </div>
            }
        </section>
    )


}