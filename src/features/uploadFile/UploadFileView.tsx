import UploadInput, { Props as PropsUpload } from '@/components/UploadInput'
import ControlButton, { Props as PropsButton } from '@/components/controlButton/ControlButton'
import { Card, CardTitle } from '@/components/ui/card'

export type Props =
    {
        title: string,
    }
    & PropsButton
    & Omit<PropsUpload, 'disabled'>

const UploadFileView = (
    {
        title,
        handleChange,
        feedback,
        phase,
        onClick,
    }: Props
) => {

    return (
        <Card className='flex flex-row justify-center align-center'>
            <CardTitle>
                <p style={{ 'lineHeight': 2 }}>{title}:</p>
            </CardTitle>
            <UploadInput
                handleChange={handleChange}
                disabled={phase === "uploading"}
            />
            <ControlButton
                feedback={feedback}
                phase={phase}
                onClick={onClick}
            />
        </Card>
    )
}

export default UploadFileView
