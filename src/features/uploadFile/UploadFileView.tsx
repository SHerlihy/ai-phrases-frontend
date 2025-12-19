import HasChangedValue from '@/components/HasChangedValue'

import { Props as PropsValue } from '@/components/HasChangedValue'
import UploadInput, { Props as PropsUpload } from '@/components/UploadInput'
import { Card, CardTitle } from '@/components/ui/card'

export type Shared = Omit<PropsValue, 'handleClick'> & Omit<PropsUpload, 'handleChange'>

export type Props = {
    title: string,
    value: string,
    hasChanged: boolean,
    isWorking: boolean,
    handleClickValue: PropsValue['handleClick']
    handleChangeUpload: PropsUpload['handleChange']
}

const UploadFileView = (
    {
        title,
        value,
        hasChanged,
        isWorking,
        handleClickValue,
        handleChangeUpload
    }: Props
) => {
    const shared: Shared = {
        value: value,
        hasChanged: hasChanged,
        isWorking: isWorking
    }

    return (
        <Card className='flex flex-row justify-center align-center'>
            <CardTitle>
                <p style={{ 'lineHeight': 2 }}>{title}:</p>
            </CardTitle>
            <UploadInput {...shared} handleChange={handleChangeUpload} />
            <HasChangedValue {...shared} handleClick={handleClickValue} />
        </Card>
    )
}

export default UploadFileView
