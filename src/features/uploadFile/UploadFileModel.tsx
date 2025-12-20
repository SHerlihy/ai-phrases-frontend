import { useMutation } from '@tanstack/react-query'
import { ChangeEvent, useEffect, useState } from 'react'
import UploadFileView from './UploadFileView'

export type GetString = () => Promise<string>
export type HandleFileUpload = (e: ChangeEvent<HTMLInputElement>) => Promise<string>

export const FEEDBACK_PENDING = "Pending..."
export const FEEDBACK_ERROR = "Error"
export type Feedback =
    | typeof FEEDBACK_PENDING
    | typeof FEEDBACK_ERROR
    | string

const UploadFileModel = ({
    title,
    getInitFeedback,
    postFile
}: {
    title: string,
    getInitFeedback: GetString,
    postFile: HandleFileUpload
}) => {
    const [feedback, setFeedback] = useState<Feedback>(FEEDBACK_PENDING)
    const [isInit, setIsInit] = useState(true)

    async function handleMutation(e?: ChangeEvent<HTMLInputElement>) {

        if (!e) {
            return await getInitFeedback()
        }
        
        setIsInit(false)

        const data = await postFile(e)

        return data

    }

    const { isPending, isError, data, mutate } = useMutation({
        mutationFn: handleMutation,
        retry: false,
        //bull
        throwOnError: false
    })

    useEffect(() => {

        mutate(undefined)

    }, [])

    useEffect(() => {

        if (isPending) {
            setFeedback(FEEDBACK_PENDING)
        }

        if (isError) {
            setFeedback(FEEDBACK_ERROR)
        }

        if (data) {
            setFeedback(data)
        }

    }, [isPending, isError, data])


    return (
        <>
            <UploadFileView
                title={title}
                feedback={feedback}
                isPending={isPending}
                isInit={isInit}
                handleChangeUpload={
                    (e) => { mutate(e) }
                }
            />
        </>
    )
}

export default UploadFileModel;
