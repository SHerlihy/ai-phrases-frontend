import { useMutation } from '@tanstack/react-query'
import { ChangeEvent, useEffect, useState } from 'react'
import UploadFileView from './UploadFileView'
import { catchError } from '@/lib/async'
import { Phase } from '@/components/controlButton/ControlButton'

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
    const [feedback, setFeedback] = useState("searching...")

    async function handleMutation() {

        const [error, data] = await catchError(uploadFile())

        if (error) {
            throw error
        }

        return data

    }

    const { isSuccess, isPending, isError, data, mutate } = useMutation({
        mutationFn: handleMutation,
        retry: false
    })

    useEffect(() => {

        mutate(undefined)

    }, [])

    useEffect(() => {

        if (isSuccess) {
            setPhase("confirm")
            setFeedback(data)
            return
        }

        if (isError) {
            setPhase("error")
            setFeedback("retry?")
            return
        }

        if (isPending) {
            setPhase("pending")
            setFeedback("cancel?")
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
                handleChange={loadFile}
                feedback={feedback}
                phase={phase}
                onClick={handleClick}
            />
        </>
    )
}

export default UploadFileModel;
