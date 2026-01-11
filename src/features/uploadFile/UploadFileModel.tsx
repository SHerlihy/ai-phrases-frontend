import { useMutation } from '@tanstack/react-query'
import { ChangeEvent, useEffect, useState } from 'react'
import UploadFileView from './UploadFileView'
import { catchError } from '@/lib/async'
import { Phase } from '@/components/controlButton/ControlButton'

export const UNABLE = "file?"
export const READY = "upload?"
export const PENDING = "cancel?"
export const ERROR = "retry?"

export const ABORT_FROM_CHANGE = "user changed file"

const UploadFileModel = ({
    title,
    loadFile,
    uploadFile,
    abortUpload
}: {
    title: string,
    loadFile: (e: ChangeEvent<HTMLInputElement>) => void,
    uploadFile: () => Promise<string>,
    abortUpload: (reason?: any) => void
}) => {
    const [phase, setPhase] = useState<Phase>("idle")
    const [feedback, setFeedback] = useState(UNABLE)

    function changeFile(e: ChangeEvent<HTMLInputElement>) {
        abortUpload(ABORT_FROM_CHANGE)
        loadFile(e)
        setPhase("ready")
        setFeedback(READY)
    }

    async function handleMutation() {

        const [error, data] = await catchError(uploadFile())

        if (error) {
            throw error
        }

        return data

    }

    const { isSuccess, isPending, isError, error, data, mutate } = useMutation({
        mutationFn: handleMutation,
        retry: false
    })

    useEffect(() => {

        if (isSuccess) {
            setPhase("confirm")
            setFeedback(data)
            return
        }

        if (
            isError &&
            error.message !== ABORT_FROM_CHANGE
        ) {
            setPhase("error")
            setFeedback(ERROR)
            return
        }

        if (isPending) {
            setPhase("pending")
            setFeedback(PENDING)
            return
        }

    }, [isPending, isError, data])

    const handleClick = () => {
        switch (phase) {
            case "ready":
                mutate()
                break;
            case "pending":
                abortUpload()
                break;
            case "error":
                mutate()
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
        <>
            <UploadFileView
                title={title}
                handleChange={changeFile}
                feedback={feedback}
                phase={phase}
                onClick={handleClick}
            />
        </>
    )
}

export default UploadFileModel;
