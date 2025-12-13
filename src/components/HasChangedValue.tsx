import { Button } from './ui/button'

export type Props = {
    value: string,
    isWorking: boolean,
    hasChanged: boolean,
    handleClick: () => void
}

const HasChangedValue = ({
    value,
    isWorking,
    hasChanged,
    handleClick
}: Props) => {
    return (
        <Button
            variant={hasChanged ? "default" : "ghost"}
            className={`
                ${isWorking ? "bg-yellow-300" : ""}
                ${hasChanged ? "bg-lime-300" : ""}
            `}
            disabled={hasChanged ? false : true}
            onClick={handleClick}
        >
            <p>{value}</p>
        </Button>
    )
}

export default HasChangedValue
