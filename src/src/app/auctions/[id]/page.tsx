import { getAuction } from "@/entry-functions";
import { Provider } from "./components/Provider";
import Head from "next/head";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const auction = await getAuction(params.id);
    return {
        title: 'Auction - ' + auction?.name,
        description: auction?.description,
        keywords: 'Auction, NFT, Create',

    };
}
export default async function Page({ params }: { params: { id: string } }) {
    const auction = await getAuction(params.id);
    return <>
        <Head>
            <title>{auction?.name}</title>
            <meta name="description" content={auction?.description} />
        </Head>
        <Provider {...auction} />
    </>;
}