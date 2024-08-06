'use client';

// External imports
import React from 'react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import {toast} from 'react-toastify';

// Internal imports
import { WalletSelectionDialog } from "@/components/WalletSelectionDialog";
import { Button } from '@/components/ui/button';
import { useMedia } from '@/hooks';
import clsx from 'clsx';
import { SelectTokenMenu } from './create-auction/components/SelectTokenMenu';

function IntroSection() {
    const { isMobile } = useMedia();
    return (
        <section id='intro' className='w-full relative flex flex-row justify-between gap-8 items-center'>
            <div className='flex flex-col gap-8 z-10'>
                <h1 className='text-5xl font-bold text-default-foreground break-words max-w-[10em]'>Aucy | Best Decentralized App for NFT Auction</h1>
                <p>Aucy DApp is application that using amazing  Hedera technology for core</p>
                <div>
                    <Button
                    onClick={()=>{
                        window.location.href='../create-auction'
                    }}
                    >Crate Auction now !</Button>
                </div>
            </div>
            <Image
                src='/assets/three-rectangles.png'
                alt='three-rectangles'
                width={600}
                height={600}
                className={clsx(
                    isMobile ? 'absolute top-1/2 -translate-y-1/2 translate-x-1/3 right-0 opacity-70' : 'relative',
                )}
            />
        </section>
    );
}
export default function Home() {

    return (
        <>
            <NextSeo
                title="Aucy | Home"
                description="Welcome to the home page"
            />
            <IntroSection />

        </>
    );

}