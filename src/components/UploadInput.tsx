import { ChangeEvent } from 'react'
import { Input } from './ui/input'

export const LABEL_TEXT = "Upload file input"

export type Props = {
    handleChange: (e: ChangeEvent<HTMLInputElement>)=>void
}

const UploadInput = (
    {
        handleChange,
        ...props
    }: React.ComponentProps<"input"> & Props
) => {
    return (
        <>
            <Input
                type='file'
                aria-label={LABEL_TEXT}
                onChange={handleChange}
                {...props}
            />
        </>
    )
}

export default UploadInput
