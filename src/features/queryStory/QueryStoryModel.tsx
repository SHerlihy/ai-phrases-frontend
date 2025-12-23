import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import QueryStoryView from './QueryStoryView'
import { useEffect, useState } from 'react'

const queryClient = new QueryClient()

export type PostMarkStory = (story: string) => Promise<[undefined, string] | [Error]>
type Props = {
    postMarkStory: PostMarkStory,
    abortMarkStory: (reason?: any) => void
}

function QueryStoryModel({
    postMarkStory,
    abortMarkStory
}: Props) {

    const { data, mutateAsync, isError } = useMutation({
        mutationFn: postMarkStory
    })

    const [marked, setMarked] = useState<string | null>(null)

    useEffect(() => {
        if (data && data[1]) {
            setMarked(data[1])
        }
    }, [data])

    return (
        <QueryClientProvider client={queryClient}>
            <QueryStoryView
                handleSubmit={async (e) => { await mutateAsync(e) }}
                isResponseError={isError}
                handleFormActionReset={abortMarkStory}
                marked={marked}
            />
        </QueryClientProvider>
    )
}

export default QueryStoryModel
