'use client';

import {
    Navbar as NextNavbar,
    NavbarBrand,
    NavbarContent,
} from "@nextui-org/react";

// Internal imports
import { ThemeSwitch } from "./ThemeSwitch";
import Image from "next/image";
import { MyWalletShortcut } from "./MyWalletShortcut";
import { ToolShortcut } from "./ToolShortcut";

export default function Navbar() {
    return (
        <NextNavbar
            maxWidth="2xl"
            className="py-2"
            classNames={{
                base: 'bg-layout-background'
            }}
        >
            <NavbarBrand className="flex flex-row items-center gap-4 cursor-pointer" onClick={()=>window.location.href='/'}>
                <Image src='/aucy.svg' alt="Aucy" width={32} height={32} />
                <p className="font-bold text-inherit text-2xl">Aucy</p>
            </NavbarBrand>
            <NavbarContent
                justify="end"
            >
                <ThemeSwitch />
                <ToolShortcut />
                <MyWalletShortcut />
            </NavbarContent>
        </NextNavbar>
    );
}