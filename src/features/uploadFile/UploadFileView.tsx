import ConfirmFeedbackButton, { Props as PropsConfirmFeedback } from '@/components/ConfirmFeedbackButton'
import UploadInput, { Props as PropsUpload } from '@/components/UploadInput'
import { Card, CardTitle } from '@/components/ui/card'

export type Props =
    {
        title: string,
        isInit: boolean,
        handleChangeUpload: PropsUpload['handleChange']
    }
    & PropsConfirmFeedback
    & Omit<PropsUpload, 'handleChange' | 'disabled'>

const UploadFileView = (
    {
        title,
        feedback,
        isPending,
        isInit,
        handleChangeUpload
    }: Props
) => {

    return (
        <Card className='flex flex-row justify-center align-center'>
            <CardTitle>
                <p style={{ 'lineHeight': 2 }}>{title}:</p>
            </CardTitle>
            <UploadInput
                handleChange={handleChangeUpload}
                disabled={!isInit ? isPending : false}
            />
            <ConfirmFeedbackButton
                feedback={feedback}
                isPending={isPending}
            />
        </Card>
    )
}

export default UploadFileView
