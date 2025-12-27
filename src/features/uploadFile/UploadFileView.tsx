import UploadInput, { Props as PropsUpload } from '@/components/UploadInput'
import { Card, CardTitle } from '@/components/ui/card'
import UploadControlButton, { Props as PropsButton } from './components/UploadControlButton'

export type Props =
    {
        title: string,
        isInit: boolean,
        handleChangeUpload: PropsUpload['handleChange']
    }
    & PropsButton
    & Omit<PropsUpload, 'handleChange' | 'disabled'>

const UploadFileView = (
    {
        title,
        feedback,
        handleChangeUpload,
        phase,
        setPhase,
        abortUpload
    }: Props
) => {

    return (
        <Card className='flex flex-row justify-center align-center'>
            <CardTitle>
                <p style={{ 'lineHeight': 2 }}>{title}:</p>
            </CardTitle>
            <UploadInput
                handleChange={handleChangeUpload}
                disabled={phase === "uploading"}
            />
            <UploadControlButton
                feedback={feedback}
                phase={phase}
                setPhase={setPhase}
                abortUpload={abortUpload}
            />
        </Card>
    )
}

export default UploadFileView
