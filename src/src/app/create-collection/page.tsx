// Internal imports
import { Chip } from '@nextui-org/react'
import CreateCollectionForm from './components/CreateCollectionForm'
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