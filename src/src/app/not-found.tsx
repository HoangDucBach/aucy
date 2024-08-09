import { useEffect } from "react";
import {Image} from '@nextui-org/react';

export default function NotFound() {

    return (
        <div className="w-full h-full flex flex-col items-center gap-2">
            <Image src="/aucy-light-logo512.png" alt="404" className="w-[360px] aspect-square" />
            <h2 className="text-2xl text-default-foreground text-center font-bold">404 Page</h2>
            <p className="text-default text-center">
                Please try again later or contact support if the issue persists.
            </p>
        </div>
    );
}