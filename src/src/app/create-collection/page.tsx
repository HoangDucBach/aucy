// Internal imports
import { Metadata } from 'next'
import CreateCollectionForm from './components/CreateCollectionForm'
export const metadata: Metadata = {
    title: 'Aucy | Create Collection',
    description: 'Create a collection for your NFTs',
    keywords: 'Collection, NFT, Create',
}
export default function Page() {
    return (
        <div className='flex flex-col gap-8 justify-between md:max-w-2xl'>
            <h1 className='text-4xl text-default-foreground font-bold'>
                Create Collection
            </h1>
            <CreateCollectionForm />
        </div>
    )
}