'use client';

import React from "react";
import { useAuctionContext } from "../context";

const checkExpired = (time: number) => {
    const now = new Date().getTime();
    const end = time;
    return now > end;
};

interface TimeLeft {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

const calculateTimeLeft = (endTime: number): TimeLeft => {
    const difference = endTime - new Date().getTime();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    return timeLeft;
};

const formatTimeLeft = (timeLeft: TimeLeft) => {
    const { days, hours, minutes, seconds } = timeLeft;
    return `${days ? days + " days " : ""}${hours ? hours + " hr " : ""}${minutes ? minutes + " min " : ""}${seconds ? seconds + " sec" : ""}`;
};

type TUnit= "days" | "hours" | "minutes" | "seconds";
const truncateUnit = (unit: TUnit) => {
    if(unit === "days") return "days";
    if(unit === "hours") return "hrs";
    if(unit === "minutes") return "mins";
    if(unit === "seconds") return "secs";
    return unit;
}
function NumberBox({ value, unit }: { value: number, unit: TUnit }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-[16px] p-2 bg-layout-foreground-100 border border-default-100 w-16 min-w-fit">
            <span className="text-2xl text-content4-foreground font-medium">{value}</span>
            <span className="text-xs text-content3-foreground font-medium">{truncateUnit(unit)}</span>
        </div>
    );
}
export function CountdownArea() {
    const auction = useAuctionContext();
    const time = Number(auction?.endingAt?.toString());

    const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(calculateTimeLeft(time));

    React.useEffect(() => {
        let timerId: NodeJS.Timeout;

        const updateTimer = () => {
            setTimeLeft(calculateTimeLeft(time));
            if (!checkExpired(time)) {
                timerId = setTimeout(updateTimer, 7); 
            }
        };

        updateTimer();

        return () => clearTimeout(timerId);
    }, [time]);

    return (
        <section id="counter" className="w-full h-fit flex flex-col gap-4">
            <h6 className="text-base text-default font-medium">Auction Ending In</h6>
            <div>
                {!checkExpired(time) && (
                    <div className="w-full flex flex-row gap-4 justify-between items-start">
                        {
                            Object.entries(timeLeft).map(([unit, value]) => (
                                <NumberBox key={unit} value={value} unit={unit as TUnit} />
                            ))
                        }
                    </div>
                )}
            </div>
        </section>
    );
}