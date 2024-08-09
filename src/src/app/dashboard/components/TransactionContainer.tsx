// External imports
import React from "react";
// Internal imports
import { getTopicMessages } from "@/entry-functions"
import { appConfig } from "@/config";
import { toast } from "react-toastify";
import { TTopicMessage } from "@/types";
import { truncateAddress } from "@/lib/address/truncate";

const AUCY_TOPIC_ID = appConfig.constants.AUCY_TOPIC_ID;

function TransactionCard({ message }: { message: TTopicMessage }) {
    return (
        <div key={message.timestamp} className="w-full flex flex-col gap-2 p-4 rounded-[20px] bg-layout-foreground-100">
            <div className="text-xs font-medium text-secondary">
                #{truncateAddress(message.accountId)}
            </div>
            <div className="text-sm text-default-foreground">
                {message.message}
            </div>
            <div className="w-full flex flex-col gap-0">
                <p className="text-sm text-default-500 font-medium">Timestamp</p>
                <div className="flex flex-row items-center justify-between">
                    <p className="break-words w-full text-xs text-default-foreground ">
                        {new Date(message.timestamp * 1000).toLocaleString('en-GB', {
                            timeZone: 'Etc/GMT',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }).replace(',', '').replace('am', 'AM').replace('pm', 'PM')}
                    </p>
                    <p className="text-xs text-secondary">GMT+7</p>
                </div>
            </div>
        </div>
    )
}
export default function TransactionContainer() {
    const [messages, setMessages] = React.useState<TTopicMessage[] | []>([]);

    const load = async () => {
        try {
            const data = await getTopicMessages(AUCY_TOPIC_ID);
            setMessages(data);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    React.useEffect(() => {
        load()
    }, []);
    return (
        <section id="auctions" className='flex flex-col gap-8 h-full w-fit'>
            <h1 className="text-2xl font-bold text-default-foreground flex flex-row items-center gap-4">
                Transactions
            </h1>
            <div className="flex flex-col gap-2">
                {messages.map((message, index) => (
                    <TransactionCard key={index} message={message} />
                ))}
            </div>
        </section>
    )
}