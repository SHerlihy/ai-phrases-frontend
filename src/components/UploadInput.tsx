import { ChangeEvent } from 'react'
import { Input } from './ui/input'

export const LABEL_TEXT = "Upload file input"

export type Props = {
    isWorking: boolean,
    handleChange: (e: ChangeEvent<HTMLInputElement>)=>void
}
const UploadInput = (
    {
        isWorking,
        handleChange
    }: Props
) => {
    return (
        <>
            <Input
                type='file'
                aria-label={LABEL_TEXT}
                disabled={isWorking ? true : false}
                onChange={handleChange}
            />
        </>
    )
}

export default UploadInput
