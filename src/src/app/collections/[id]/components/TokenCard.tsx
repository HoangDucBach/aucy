'use client';

import { getMetadata } from "@/entry-functions";
import { TokenInfo } from "@hashgraph/sdk";
import { useEffect, useState } from "react";

// Internal imports
import { useCollection } from "../context";
import clsx from "clsx";

export function TokenCard(props: {
    token: any;
}) {
    const { token } = props;
    const collection = useCollection();
    const [metadata, setMetadata] = useState<any>(null);
    const loadMetadata = async () => {
        if (!token.metadata) return;
        const data = await getMetadata(token.metadata);
        setMetadata(data);
    }
    useEffect(() => {
        loadMetadata();
    }, [token]);

    return (
        <div className={clsx([
            "flex flex-col gap-8 items-center justify-between p-4 rounded-[32px] bg-layout-foreground-100 w-full h-full",

        ])}>
            <img
                src={metadata ? metadata.image : 'https://fakeimg.pl/500x500?text=Image&font=bebas'}
                alt={'token image'}
                className="rounded-[32px] w-full aspect-[1/1]"
            />
            <div className="w-full flex flex-row items-center gap-2 justify-between">
                <h1 className="text-lg font-bold text-default-foreground">{metadata?.name || collection.name}</h1>
                <p className="text-base font-normak text-default-500">#{token.serial_number}</p>
            </div>
        </div>
    );
}