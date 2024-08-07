'use client';

// External imports
import React from "react";
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Tabs, Tab, Input } from "@nextui-org/react";
import dynamic from 'next/dynamic';
const DynamicAuctionsContainer = dynamic(() => import('./AuctionsContainer'), {
    ssr: false
});
const DynamicCollectionsContainer = dynamic(() => import('./CollectionsContainer'), {
    ssr: false
});
export default function Main() {
    const [searchParam, setSearchParam] = React.useState<string>('');
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = React.useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )
    React.useEffect(() => {
        router.push(
            `${pathname}?${createQueryString('search', searchParam)}`
        )
    }, [searchParam]);
    return (
        <div className="flex flex-col gap-8 w-full h-full">
            <Input
                placeholder="Search"
                radius="full"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
            />
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
            </Tabs>
        </div>
    )
}