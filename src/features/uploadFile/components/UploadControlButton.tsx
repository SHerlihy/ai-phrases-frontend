import { Button } from "@/components/ui/button"
import { Dispatch, SetStateAction } from "react"


export type Props = {
    phase: Phase,
    setPhase: Dispatch<SetStateAction<Phase>>
    feedback: string,
    abortUpload: (reason?: any) => void
}

const UploadControlButton = ({
    phase,
    setPhase,
    feedback,
    abortUpload,
    ...props
}: React.ComponentProps<"button"> & Props) => {
    return (
        <Button
            onClick={() => {
                switch (phase) {
                    // case "ready":
                    //     handleUpload()
                    //     break;
                    case "uploading":
                        abortUpload()
                        setPhase("ready")
                        break;
                    case "error":
                        setPhase("ready")
                        break;
                    case "confirm":
                        setPhase("idle")
                        break;

                    default:
                        break;
                }
            }}
            className={`
                ${phase !== "idle" && "cursor-pointer"}
                ${phase === "uploading" && "hover:bg-yellow-400 bg-yellow-500"}
                ${phase === "confirm" && "hover:bg-lime-400 bg-lime-500"}
                ${phase === "error" && "hover:bg-red-400 bg-red-500"}
            `}
            disabled={phase === "idle"}
            {...props}
        >
            {phase === "idle" && <p>{feedback}</p>}
            {phase === "ready" && <p>Upload</p>}
            {phase === "uploading" && <p>{feedback}</p>}
            {phase === "confirm" && <p>{feedback}</p>}
            {phase === "error" && <p>{feedback}</p>}
        </Button>
    )
}

export default UploadControlButton
