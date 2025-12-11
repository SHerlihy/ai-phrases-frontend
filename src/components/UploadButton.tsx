import { Button } from './ui/button'

type Props = {
    isWorking: boolean,
    handleClick: () => void
}
const UploadButton = (
    {
        isWorking,
        handleClick
    }: Props
) => {
    return (
        <Button
            disabled={isWorking ? true : false}
            variant="default"
            onClick={handleClick}
        >
            Upload
        </Button>
    )
}

export default UploadButton
