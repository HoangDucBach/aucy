"use client";

import { useEffect } from "react";
import {Image} from '@nextui-org/react';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        /* eslint-disable no-console */
        console.error(error);
    }, [error]);

    return (
        <div className="w-full h-full flex flex-col items-center gap-2">
            <Image
                src="/aucy-light-logo512.png" alt="404"
                className="w-[360px] aspect-square"
                width={360}
                height={360}
            />
            <h2 className="text-2xl text-default-foreground font-bold text-center">Something went wrong!</h2>
            <p className="text-default text-center">
                Please try again later or contact support if the issue persists.
            </p>
        </div>
    );
}