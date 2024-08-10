'use client';

// External imports
import React from "react";
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Tabs, Tab, Input } from "@nextui-org/react";
import dynamic from 'next/dynamic';
import TransactionContainer from "./components/TransactionContainer";
const DynamicAuctionsContainer = dynamic(() => import('./components/AuctionsContainer'), {
    ssr: false
});
const DynamicCollectionsContainer = dynamic(() => import('./components/CollectionsContainer'), {
    ssr: false
});
const DynamicMyCollectionsContainer = dynamic(() => import('./components/MyCollectionsContainer'), {
    ssr: false
});
export default function Main() {
    const [searchParam, setSearchParam] = React.useState<string>('');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = React.useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    React.useEffect(() => {
        router.push(
            `${pathname}?${createQueryString('search', searchParam)}`
        );
    }, [searchParam, createQueryString, pathname, router]);

    return (
        <div className="flex flex-col gap-8 w-full h-full">
            <Input
                placeholder="Search"
                radius="full"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="md:col-span-2">
                    <Tabs
                        variant="light"
                        radius="full"
                        color="primary"
                    >
                        <Tab key="auctions" title="Auction">
                            <DynamicAuctionsContainer />
                        </Tab>
                        <Tab key="collections" title="Collection">
                            <DynamicCollectionsContainer />
                        </Tab>
                        <Tab key="my-collections" title="My Collection">
                            <DynamicMyCollectionsContainer />
                        </Tab>
                    </Tabs>
                </div>
                <div className="md:col-span-1">
                    <TransactionContainer />
                </div>
            </div>
        </div>
    );
}