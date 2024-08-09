// External imports
import {Image} from '@nextui-org/react';

// Internal imports
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { useAuctionContext } from "../context";

export default function DetailsArea() {
    const { walletInterface } = useWalletInterface();
    const auction = useAuctionContext();

    return (
        <section id="counter" className="w-full h-fit flex flex-col gap-4">
            <h6 className="text-base text-default font-medium">Details</h6>
            <div className="w-full flex flex-col gap-4 items-center justify-between">
                <div className="w-full flex flex-row items-center justify-between">
                    <p className="text-default-foreground font-medium text-base">Ending Price</p>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-default-foreground text-base">{auction?.endingPrice?.toString()}</p>
                        <Image
                            src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                            alt='hbar logo'
                            className='w-4 h-4'
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <p className="text-default-foreground font-medium text-base">Min Bid Increment</p>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-default-foreground text-base">{auction?.minBidIncrement?.toString()}</p>
                        <Image
                            src={'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032'}
                            alt='hbar logo'
                            className='w-4 h-4'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}