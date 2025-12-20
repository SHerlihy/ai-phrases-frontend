import { LABEL_TEXT } from "@/components/UploadInput"
import { withResolvers } from "@/lib/async"
import { Screen } from "@testing-library/react"
import { UserEvent } from "@testing-library/user-event"
import { GetString, HandleFileUpload } from "./UploadFileModel"

type HTMLInputElementWithFiles = HTMLInputElement & { files: FileList }
export async function uploadFile(screen: Screen, user: UserEvent, file?: File): Promise<HTMLInputElementWithFiles> {
    if (file === undefined) {
        file = new File(['hello'], 'hello.png', { type: 'image/png' })
    }

    const fileInput = await screen.findByLabelText(LABEL_TEXT)

    while (fileInput !== document.activeElement) {
        await user.tab()
    }

    if (fileInput instanceof HTMLInputElement === false) {
        throw new Error(`Not Input Element for: Label - "${LABEL_TEXT}"`)
    }

    await user.upload(fileInput, file)

    if (fileInput.files === null) {
        throw new Error("Files not on input")
    }

    return fileInput as HTMLInputElementWithFiles
}

export function getInitFeedbackResolvers() {
    const { promise, resolve, reject } = withResolvers()
    const getInitFeedback: GetString = async () => { return await promise as Promise<string> }

    return { getInitFeedback, resolve, reject }
}

export function getUploadResolvers() {
    const { promise, resolve, reject } = withResolvers()
    const handleFileUpload: HandleFileUpload = async () => { return await promise as Promise<string> }

    return { handleFileUpload, resolve, reject }
}

