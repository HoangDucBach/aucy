// External imports
import React from "react";
import { Metadata, Viewport } from "next";
import { useTheme } from "next-themes";
import clsx from "clsx";
import 'react-toastify/dist/ReactToastify.css';

// Internal imports
import { Providers } from "./providers";
import { appConfig } from "@/config";
import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
    title: 'Aucy | NFT Auction Platform',
    description: appConfig.constants.METADATA.description,
    icons: [
        { 
            href: "/favicon.ico",
            sizes: "16x16",
            type: "image/x-icon",
            url: "/favicon.ico",
         },
    ],

};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en" className=" bg-layout-background ">
            <head />
            <body
                className={clsx(
                    "min-h-screen font-sans antialiased",
                )}
            >
                <Providers themeProps={{ attribute: "class", defaultTheme: "dark", children: children }}>
                    <div className="relative flex flex-col h-screen w-full overflow-x-clip ">
                        <Navbar />
                        <main className="container mx-auto pt-4 md:pt-8 px-4 flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}