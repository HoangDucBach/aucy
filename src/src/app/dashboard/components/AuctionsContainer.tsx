// @refresh reset

// External imports
import React, { useEffect, useState } from 'react';

// Internal imports
import { getAuctions, getMetadata, getNftInfo } from "@/entry-functions";
import { TAuction } from "@/types";
import { Chip, Image, Spinner } from '@nextui-org/react';
import { GoDotFill } from 'react-icons/go';
import { checkIsExpired } from '@/lib/helpers';
import clsx from 'clsx';
import { truncateAddress } from '@/lib/address/truncate';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';



function AuctionCard({ auction }: { auction: TAuction }) {
    const [nftInfo, setNftInfo] = useState<any>(null);
    const [metadata, setMetadata] = useState<any>(null);
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const router = useRouter();
    const load = React.useCallback(async () => {
        try {
            if (!auction.tokenAddress || !auction.tokenId) return;
            const nftInfo = await getNftInfo(auction.tokenAddress, auction.tokenId);
            setNftInfo(nftInfo);

            const metadata = await getMetadata(nftInfo.metadata);
            setMetadata(metadata);


            setIsExpired(checkIsExpired(Number(auction.endingAt?.toString())));
        } catch (error: any) {
            toast.error('Failed to load auction');
            console.error(error);
        }
    }, [auction.tokenAddress, auction.tokenId, auction.endingAt]);
    useEffect(() => {
        load();
    }, [auction.tokenAddress, auction.tokenId, auction.endingAt, load]);


    return (
        <div
            key={auction.name}
            className={clsx(
                'flex flex-col gap-4 h-fit w-full max-w-[360px]',
                "bg-layout-foreground-100 p-4 rounded-[20px]",
                "cursor-pointer",
                "hover:scale-[1.02] transition-transform duration-300 ease-in-out"
            )}
            onClick={() => router.push(`../auctions/${auction.id}`)}
        >
            <Image
                isLoading={!nftInfo}
                src={metadata?.image || 'https://fakeimg.pl/500x500?text=Image&font=bebas'}
                alt={metadata?.name}
                classNames={{
                    img: "w-full aspect-square object-cover rounded-[20px]",
                }}
            />
            <div className={clsx(
                "flex flex-row items-center justify-between h-fit w-full",
            )}>
                <h1 className="text-base font-medium text-default-foreground w-full max-w-[16em] break-words">{auction?.name}</h1>
                <Chip
                    variant={'dot'}
                    color={isExpired ? 'danger' : 'success'}
                    radius="full"
                    classNames={{
                        base: 'w-full',
                    }}
                    startContent={
                        !isExpired ?
                            <div className="text-success mr-4">
                                <GoDotFill size={24} className="absolute top-0 left-0 animate-ping" />
                                <GoDotFill size={24} className="absolute top-0 left-0" />
                            </div>
                            :
                            <GoDotFill size={24} className="absolute top-0 left-0 text-danger" />
                    }
                >
                    {isExpired ? 'Ended' : 'Live'}
                </Chip>
            </div>
            <div className='flex flex-row items-center justify-between w-full'>
                <p className='text-xs font-semibold text-default-500'>Current Bid</p>
                <p className='flex flex-row gap-2 items-center text-xs font-medium text-default-foreground'>
                    {auction?.highestBid?.toString()}
                    <span>
                        <Image
                            src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                            alt='hbar logo'
                            width={24}
                            height={24}
                        />
                    </span>
                </p>
            </div>
            <div className='flex flex-row items-center justify-between w-full'>
                <p className='text-xs font-semibold text-default-500'>Collection</p>
                <p className='text-xs font-medium text-default-foreground'>
                    {truncateAddress(auction?.tokenAddress || 'N/A')}
                </p>
            </div>
        </div>
    )

}
export default function AuctionsContainer() {
    const [auctions, setAuctions] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getAuctions();
            setAuctions(data);
        }
        fetchData();
    }, []);

    if (!auctions) return <div className='w-full text-center h-full'>
        <Spinner label="Loading ..." color="primary" labelColor="primary" />
    </div>;
    console.log('auctions', auctions);
    return (
        <section id="auctions" className='flex flex-col gap-8'>
            <h1 className="text-2xl font-bold text-default-foreground flex flex-row items-center gap-4">
                Auctions
                <Image
                    src='/assets/auction-icon.svg'
                    alt='auction icon'
                    width={32}
                    height={32}
                    radius='none'
                />
            </h1>
            <div
                className={clsx(
                    'grid content-start [--column-gap:12px] min-720:[--column-gap:24px] gap-x-[--column-gap] gap-y-4 min-720:gap-y-8 [--min-column-width:300px] min-720:[--min-column-width:324px] min-840:[--min-column-width:384px] [--max-column-count:5] [--total-gap-width:calc((var(--max-column-count)-1)*var(--column-gap))] [--max-column-width:calc((100%-var(--total-gap-width))/var(--max-column-count))] grid-cols-[repeat(auto-fill,minmax(max(var(--min-column-width),var(--max-column-width)),1fr))]',
                )}
            >
                {auctions.map((auction: TAuction, index: number) => (
                    <AuctionCard auction={auction} key={index} />
                ))}
            </div>
        </section>

    );
}