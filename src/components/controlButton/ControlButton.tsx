import { Button } from "@/components/ui/button"

export type Phase = "idle" | "pending" | "ready" | "confirm" | "error"

export type Props = {
    phase: Phase,
    feedback: string,
}
    & React.ComponentProps<"button">

const ControlButton = ({
    phase,
    feedback,
    ...props
}: Props) => {
    return (
        <Button
            className={`
                ${phase !== "idle" && "cursor-pointer"}
                ${phase === "pending" && "hover:bg-yellow-400 bg-yellow-500"}
                ${phase === "confirm" && "hover:bg-lime-400 bg-lime-500"}
                ${phase === "error" && "hover:bg-red-400 bg-red-500"}
            `}
            disabled={phase === "idle"}
            {...props}
        >
            {feedback}
        </Button>
    )
}

export default ControlButton
