import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import QueryStoryView from './QueryStoryView'
import { useEffect, useState } from 'react'
import { Phase } from '@/components/controlButton/ControlButton'

const queryClient = new QueryClient()

type Props = {
    postMarkStory: (story: string) => Promise<string>,
    abortMarkStory: (reason?: any) => void
}

function QueryStoryModel({
    postMarkStory,
    abortMarkStory
}: Props) {
    const [feedback, setFeedback] = useState("submit")
    const [phase, setPhase] = useState<Phase>("ready")

    const { data, mutateAsync, isError, isPending, isSuccess } = useMutation({
        mutationFn: postMarkStory
    })

    const [marked, setMarked] = useState<string | null>(null)

    useEffect(() => {
        if (data) {
            setMarked(data)
        }
    }, [isSuccess])

    useEffect(() => {

        if (isSuccess) {
            setPhase("ready")
            setFeedback("submit")
            return
        }

        if (isError) {
            setPhase("error")
            setFeedback("retry?")
            return
        }

        if (isPending) {
            setPhase("uploading")
            setFeedback("cancel?")
            return
        }

    }, [isPending, isError, data])

    const handleClick = (handleQuery: () => void) => {
        switch (phase) {
            case "ready":
                handleQuery()
                break;
            case "uploading":
                abortMarkStory()
                break;
            case "error":
                handleQuery()
                break;
            case 'confirm':
                setPhase("ready")
                break;
            case 'idle':
                break;

            default:
                setPhase("ready")
                break;
        }
    }

    return (
        <QueryClientProvider client={queryClient}>
            <QueryStoryView
                marked={marked}
                feedback={feedback}
                phase={phase}
                handleQuery={async (story) => { await mutateAsync(story) }}
                handleClick={handleClick}
            />
        </QueryClientProvider>
    )
}

export default QueryStoryModel
