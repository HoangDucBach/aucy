'use client';

// External imports
import { RiAuctionFill } from "react-icons/ri";
import { HiCollection } from "react-icons/hi";
import { useRouter } from 'next/navigation'

// Internal imports
import { useMedia } from "@/hooks";
import { Button } from "./ui/button";

export function ToolShortcut() {
    const { isMobile } = useMedia();
    const router = useRouter()

    return (
        <div className="flex flex-row items-center gap-4">
            <Button
                isIconOnly={isMobile}
                startContent={<RiAuctionFill size={24} />}
                color="default"
                radius="full"
                onClick={() => router.push('../create-auction')}
            >
                {isMobile ? null : 'Create Auction'}
            </Button>
            <Button
                isIconOnly={isMobile}
                startContent={<HiCollection size={24} />}
                color="default"
                radius="full"
                onClick={() => router.push('../create-collection')}
            >
                {isMobile ? null : 'Create Collection'}
            </Button>
        </div>
    )
}