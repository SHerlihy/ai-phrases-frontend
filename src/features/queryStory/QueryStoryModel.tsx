import { useMutation } from '@tanstack/react-query'
import QueryStoryView from './QueryStoryView'
import { useEffect, useState } from 'react'
import { Phase } from '@/components/controlButton/ControlButton'

export const FEEDBACK_READY = "submit"
export const FEEDBACK_ERROR = "retry?"
export const FEEDBACK_PENDING = "cancel?"

type Props = {
    postMarkStory: (story: string) => Promise<string>,
    abortMarkStory: (reason?: any) => void
}

function QueryStoryModel({
    postMarkStory,
    abortMarkStory
}: Props) {
    const [feedback, setFeedback] = useState(FEEDBACK_READY)
    const [phase, setPhase] = useState<Phase>("ready")

    const { data, mutateAsync, isError, isPending, isSuccess } = useMutation({
        mutationFn: postMarkStory
    })

    const [marked, setMarked] = useState<string | null>(null)

    useEffect(() => {

        setMarked(null)

        if (isSuccess && data) {
            setMarked(data)
        }

    }, [isPending])

    useEffect(() => {

        if (isSuccess) {
            setPhase("ready")
            setFeedback(FEEDBACK_READY)
            return
        }

        if (isError) {
            setPhase("error")
            setFeedback(FEEDBACK_ERROR)
            return
        }

        if (isPending) {
            setPhase("pending")
            setFeedback(FEEDBACK_PENDING)
            return
        }

    }, [isPending, isError, data])

    const handleClick = (handleQuery: () => void) => {
        switch (phase) {
            case "ready":
                handleQuery()
                break;
            case "pending":
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
        <QueryStoryView
            marked={marked}
            feedback={feedback}
            phase={phase}
            handleQuery={async (story) => { await mutateAsync(story) }}
            handleClick={handleClick}
        />
    )
}

export default QueryStoryModel
