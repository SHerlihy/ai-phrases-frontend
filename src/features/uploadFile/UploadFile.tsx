import HasChangedValue from '@/components/HasChangedValue'
import UploadButton from '@/components/UploadButton'

import { Props as PropsValue } from '@/components/HasChangedValue'
import { Props as PropsUpload } from '@/components/UploadButton'
import { Card, CardAction } from '@/components/ui/card'

type Shared = Omit<PropsValue, 'handleClick'> & Omit<PropsUpload, 'handleClick'>

type Props = {
    shared: Shared,
    handleClickValue: PropsValue['handleClick']
    handleClickUpload: PropsUpload['handleClick']
}

const UploadFile = (props: Props) => {
    const {
        shared,
        handleClickValue,
        handleClickUpload
    } = props

    return (
        <Card className='flex flex-row justify-center'>
            <CardAction>
                <HasChangedValue {...shared} handleClick={handleClickValue} />
                <UploadButton {...shared} handleClick={handleClickUpload} />
            </CardAction>
        </Card>
    )
}

export default UploadFile
