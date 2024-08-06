'use client';
// Internal imports
import { Chip } from '@nextui-org/react'
import CreateAuctionForm from './components/CreateAuctionForm'
export default function Page() {
    return (
        <div className='flex flex-col gap-8 justify-between md:max-w-2xl'>
            <h1 className='flex flex-row gap-4 justify-between md:justify-start items-center text-4xl text-default-foreground font-bold'>
                Create Auction
                <Chip variant='bordered' radius='sm' size='md' classNames={{ base: 'border-default-foreground' }}>
                    NFT
                </Chip>
            </h1>
            <CreateAuctionForm />
        </div>
    )
}