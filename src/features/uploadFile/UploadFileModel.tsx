import { useMutation } from '@tanstack/react-query'
import { ChangeEvent, useEffect, useState } from 'react'
import UploadFileView from './UploadFileView'
import { catchError } from '@/lib/async'

export type GetString = () => Promise<string>
export type HandleFileUpload = (e: ChangeEvent<HTMLInputElement>) => Promise<string>
export type Phase = "idle" | "uploading" | "ready" | "confirm" | "error"

export const FEEDBACK_PENDING = "Cancel upload..."
export const FEEDBACK_ERROR = "Error"
export type Feedback =
    | typeof FEEDBACK_PENDING
    | typeof FEEDBACK_ERROR
    | string

const UploadFileModel = ({
    title,
    getInitFeedback,
    uploadFile,
    abortUpload
}: {
    title: string,
    getInitFeedback: GetString,
    uploadFile: HandleFileUpload,
    abortUpload: (reason?: any) => void
}) => {
    const [feedback, setFeedback] = useState<Feedback>(FEEDBACK_PENDING)
    const [isInit, setIsInit] = useState(true)
    const [phase, setPhase] = useState<Phase>("idle")

    async function handleMutation(e?: ChangeEvent<HTMLInputElement>) {

        if (!e) {
            const [error, feedback] = await catchError(getInitFeedback())

            if (error) {
                throw error
            }

            return feedback
        }

        setIsInit(false)

        const [error, data] = await catchError(uploadFile(e))

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
            setFeedback(FEEDBACK_ERROR)
            return
        }

        if (isPending && !isInit) {
            setPhase("uploading")
            setFeedback(FEEDBACK_PENDING)
            return
        }

    }, [isPending, isError, data])

    return (
        <>
            <UploadFileView
                title={title}
                feedback={feedback}
                isInit={isInit}
                handleChangeUpload={mutate}
                phase={phase}
                setPhase={setPhase}
                abortUpload={abortUpload}
            />
        </>
    )
}

export default UploadFileModel;
