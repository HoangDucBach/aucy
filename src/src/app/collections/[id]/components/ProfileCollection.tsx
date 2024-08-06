'use client';

// External imports
import { useCollection } from "../context";
import { Chip } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { Mint } from "./Mint";


interface ProfileCollectionProps {

}
export function ProfileCollection(props: ProfileCollectionProps) {
    const { id } = useParams();
    const collection = useCollection();

    const items: {
        title: string;
        value: any;
    }[] = [
            { title: 'Symbol', value: collection.symbol },
            { title: 'Decimals', value: collection.decimals || 'N/A' },
            { title: 'Total Supply', value: collection.totalSupply || 'N/A' },
        ];
    const renderItems = (title: string, value: string, index: number) => {
        return (
            <div key={index}>
                <h6 className="text-sm font-medium text-default-500">{title}</h6>
                <p className="text-base font-medium text-default-600">{value}</p>
            </div>
        );
    }
    return (
        <div className={"relative bg-layout-foreground-100 rounded-[32px] p-4 w-fit md:min-w-[360px] h-full md:h-fit"}>
            {
                collection.deleted && (
                    <Chip color="danger" radius="full" className="rotate-45 absolute top-0 right-0 translate-x-1/2">Deleted</Chip>
                )
            }
            <div className="flex flex-col items-center gap-8 md:justify-between w-full h-full">
                <img
                    src={collection.image || 'https://placehold.jp/360x360.png'}
                    alt="Collection Image"
                    className="rounded-[32px] w-full aspect-auto object-cover"
                />
                <div className="w-full flex flex-row flex-wrap justify-between">
                    <h1 className="text-4xl font-bold text-default-foreground w-full break-words">{collection.name}</h1>
                    <Chip>{id}</Chip>
                </div>
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                    {
                        (items && items.length > 0) ?
                            items.map((item, index) => {
                                return renderItems(item.title, item.value, index);
                            })
                            :
                            <p className="text-base text-default">No data</p>
                    }
                </div>
                <Mint />
            </div>
        </div>
    );
}