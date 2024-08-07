// External imports
import React from "react";
// Internal imports
import { getTopicMessages } from "@/entry-functions"
import { appConfig } from "@/config";
import { toast } from "react-toastify";

const AUCY_TOPIC_ID = appConfig.constants.AUCY_TOPIC_ID;
export default function TransactionContainer() {
    const [messages, setMessages] = React.useState<string[]>([]);

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
        <section id="auctions" className='flex flex-col gap-8 h-full w-full'>
            <h1 className="text-2xl font-bold text-default-foreground flex flex-row items-center gap-4">
                Transactions
            </h1>
            <div className="flex flex-col gap-2">
                {messages.map((message, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <div className="text-sm text-default-foreground">
                            {message}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}