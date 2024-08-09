'use client';
// External imports
import React from "react";

// Internal imports
import { getTokenInfo } from "@/entry-functions";
import { CollectionContext } from "./context";
import { ProfileCollection } from "./components/ProfileCollection";
import { NftsContainer } from "./components/NftsContainer";
import { toast } from "react-toastify";
import Head from "next/head";

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const [collection, setCollection] = React.useState<any>(null);
    React.useEffect(() => {
        getTokenInfo(id)
        .then(data => {
            setCollection(data);
        })
        .catch(err => {
            toast.error('Failed to fetch collection');
        });
    }, [id, collection]);
    if(!collection) return <div>Loading...</div>;
    return (
        <CollectionContext.Provider value={collection}>
            <Head>
                <title>{'Collection - '+collection.name}</title>
                <meta name="description" content={collection.description} />
            </Head>
            <div className="flex flex-col md:flex-row gap-8 w-full h-full">
                <ProfileCollection />
                <NftsContainer />
            </div>
        </CollectionContext.Provider>
    );
}