'use client';
// External imports
import React from "react";
import { GoDotFill } from "react-icons/go";
import { PiGiftFill } from "react-icons/pi";
import { PiWarningCircleFill } from "react-icons/pi";

// Internal imports
import { useAuctionContext } from "../context";
import { TAuction } from "@/types";
import { Chip, divider, Tooltip } from "@nextui-org/react";
import { Button } from "@/components/ui/button";

const checkExpired = (auction: TAuction) => {
    const now = new Date().getTime();
    const end = Number(auction.endingAt?.toString());
    return now > end;
};
function DonationArea() {
    const auction = useAuctionContext();
    const [donation, setDonation] = React.useState<number>(0);

    React.useEffect(() => {
        if (auction?.donation) {
            setDonation(auction.donation);
        }
    }, [auction]);

    return (
        <Tooltip
            content={
                <p className="text-center">Donations of auctions,<br /> it won't include in final price!</p>
            }
            placement="top"
            offset={32}
        >
            <button className="relative w-full h-fit flex flex-col justify-between gap-2 items-center rounded-[24px] border border-default-50 bg-layout-foreground-100 md:w-fit md:aspect-square p-4">
                <PiGiftFill size={48} className="shadow-primary text-primary" />
                <div className="flex flex-row gap-2 items-center w-full">
                    <p className="text-default-foreground font-semobild text-base text-start w-full md:w-fit">{donation}</p>
                    <img
                        src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                        alt='hbar logo'
                        className='w-6 h-6'
                    />
                </div>
            </button>
        </Tooltip>
    )
}
export function HeaderArea() {
    const auction = useAuctionContext();
    const [isExpired, setIsExpired] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsExpired(checkExpired(auction!));
    }, [auction]);

    return (
        <section id="name" className="w-full h-fit">
            <div className="flex flex-col gap-4 h-fit w-full">
                <div className="w-full flex gap-4 flex-col md:flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-4 h-fit w-full">
                        <h1 className="text-4xl font-bold text-default-foreground">{auction?.name}</h1>
                        <Chip
                            variant={'dot'}
                            color={isExpired ? 'danger' : 'success'}
                            radius="full"
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

                            {checkExpired(auction!) ? 'Ended' : 'Live'}
                        </Chip>
                    </div>
                    <DonationArea />
                </div>
                <p className="text-base text-default-foreground font-medium h-fit break-words">{auction?.description}</p>
            </div>
        </section>
    )
}