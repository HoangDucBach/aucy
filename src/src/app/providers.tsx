"use client";

import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ThemeProviderProps} from "next-themes/dist/types";
import {AllWalletsProvider} from "@/services/wallets/AllWalletsProvider";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({children, themeProps}: ProvidersProps) {
    return (
        <AllWalletsProvider>
            <NextUIProvider>
                <NextThemesProvider {...themeProps}>
                    {children}
                </NextThemesProvider>
            </NextUIProvider>
        </AllWalletsProvider>
    );
}