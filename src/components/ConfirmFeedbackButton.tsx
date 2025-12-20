import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { FEEDBACK_PENDING } from '@/features/uploadFile/UploadFileModel'

export type Props = {
    feedback: string,
    isPending: boolean
}

const ConfirmFeedbackButton = ({
    feedback,
    isPending,
    ...props
}: React.ComponentProps<"button"> & Props) => {
    return (
        <Button
            disabled={isPending}
        >
            <p>{feedback}</p>
        </Button>
    )
}

// const ConfirmFeedbackButton = ({
//     feedback,
//     isPending,
//     ...props
// }: React.ComponentProps<"button"> & Props) => {
//
//     const [canConfirm, setCanConfirm] = useState(false)
//
//     useEffect(() => {
//         if (!isPending) {
//             setCanConfirm(true)
//         }
//     }, [isPending])
//
//     return (
//         <Button
//             variant={canConfirm ? "default" : "ghost"}
//             className={`
//                 ${isPending && "bg-yellow-300"}
//                 ${canConfirm && "bg-lime-300"}
//             `}
//             onClick={() => { setCanConfirm(false) }}
//             disabled={isPending}
//             {...props}
//         >
//             <p>{feedback}</p>
//         </Button>
//     )
// }

export default ConfirmFeedbackButton
