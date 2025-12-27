import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import QueryStoryView, { HandleSubmit } from './QueryStoryView'
import { useEffect, useState } from 'react'

const queryClient = new QueryClient()

type Props = {
    postMarkStory: HandleSubmit,
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
                handleSubmit={mutateAsync}
                isResponseError={isError}
                handleFormActionReset={abortMarkStory}
                marked={marked}
            />
        </QueryClientProvider>
    )
}

export default QueryStoryModel
