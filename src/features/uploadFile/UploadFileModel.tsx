import { useMutation, useQuery } from '@tanstack/react-query'
import { ChangeEvent, useEffect, useState } from 'react'
import UploadFileView from './UploadFileView'

export type GetString = () => Promise<string>
export type HandleFileUpload = (e: ChangeEvent<HTMLInputElement>) => Promise<void>

export const FEEDBACK_PENDING = "Pending..."
export const FEEDBACK_ERROR = "Error"

const UploadFileModel = ({
    title,
    getInitFeedback,
    postFile
}: {
    title: string,
    getInitFeedback: GetString,
    postFile: HandleFileUpload
}) => {
    const [feedback, setFeedback] = useState("")
    // const [noUpload, setNoUpload] = useState(true)

    const { isPending: initPending, isError: initError, data: initData } = useQuery({
        queryKey: [title],
        queryFn: getInitFeedback,
        retry: false
    })

    useEffect(() => {
        if (initPending) {
            setFeedback(FEEDBACK_PENDING)
        }

        if (initError) {
            setFeedback(FEEDBACK_ERROR)
        }

        if (initData) {
            setFeedback(initData)
        }
    }, [initPending, initError, initData])

    // const { isPending, isSuccess, isError, data, mutate } = useMutation({
    //     mutationFn: postFile
    // })
    //
    // const firstUpload = (e: ChangeEvent<HTMLInputElement>) => {
    //     // setNoUpload(true)
    //     mutate(e)
    // }
    //
    // if (noUpload) {
    return (
        <>
            <UploadFileView
                title={title}
                value={feedback}
                hasChanged={false}
                isWorking={false}
                handleClickValue={() => { }}
                // handleChangeUpload={firstUpload}
                handleChangeUpload={(e)=>{}}
            />
        </>
    )
    // }

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

    const handleClickValue = () => { }

    return <UploadFileView
        title={title}
        value={feedback}
        hasChanged={isSuccess}
        isWorking={isPending}
        handleClickValue={handleClickValue}
        handleChangeUpload={mutate}
    />
}

export default UploadFileModel;
