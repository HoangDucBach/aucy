import React from "react";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { useAuctionContext } from "../context";
import { TReceiver } from "@/types";


export function ReceiverCard({ receiver }: { receiver: TReceiver }) {
    return (
        <div className="w-full flex flex-row items-center justify-between">
            <p className="text-default-foreground text-base font-medium">{receiver.address}</p>
            <p className="text-secondary text-base font-medium">{receiver.percentage?.toString()}%</p>
        </div>
    )
}
export default function ReceiversArea() {
    const auction = useAuctionContext();
    const [receivers, setReceivers] = React.useState<TReceiver[]>([]);

    const updateReceivers = React.useCallback(() => {
        if (auction) {
            if (auction.receivers && auction.percentages) {
                for (let i = 0; i < auction.receivers.length; i++) {
                    receivers.push({
                        address: auction.receivers[i],
                        percentage: Number(auction.percentages[i])
                    });
                }
            }
        }
    }, [auction, receivers]);

    React.useEffect(() => {
        updateReceivers();
    }, [auction, updateReceivers]);
    return (
        <section id="counter" className="w-full h-fit flex flex-col gap-4">
            <h6 className="text-base text-default font-medium">Receivers</h6>
            <div className="w-full flex flex-col gap-4 items-center justify-between">
                {
                    receivers.map((receiver, index) => (
                        <ReceiverCard key={index} receiver={receiver} />
                    ))
                }
                {
                    receivers.length === 0 && (
                        <p className="text-default-foreground text-base font-medium">No receivers</p>
                    )
                }
            </div>
        </section>
    )
}