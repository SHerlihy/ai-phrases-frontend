import { describe, expect, it } from 'vitest';
import { render, Screen, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import UploadFileModel, { FEEDBACK_PENDING, GetString, HandleFileUpload } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LABEL_TEXT } from '@/components/UploadInput';

const queryClient = new QueryClient()

describe('UploadPhrases', () => {
    const initFeedbackSuccessStr = "init success"
    const successInitFeedback: GetString = async () => { return initFeedbackSuccessStr }

    const postFileSuccessStr = "post success"
    const successPostFile: HandleFileUpload = async () => { return }
    it('renders the component', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={successInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )
        screen.debug();
    })

    it('tab navigate to file input', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={successInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )
        const user = userEvent.setup()

        const fileInput = await screen.findByLabelText(LABEL_TEXT)

        while (fileInput !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(fileInput)
    })

    it('shows feedback success', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={successInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )

        const feedbackSuccess = await screen.findByText(initFeedbackSuccessStr)

        expect(feedbackSuccess).not.toBeNull()
    })

    // note very behaviour-y
    it('allows file upload', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={successInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )

        const file = new File(['hello'], 'hello.png', { type: 'image/png' })
        const user = userEvent.setup()

        const fileInput = await uploadFile(screen, user, file)

        expect(fileInput.files[0]).toBe(file)
        expect(fileInput.files.item(0)).toBe(file)
        expect(fileInput.files).toHaveLength(1)
    })
})

type HTMLInputElementWithFiles = HTMLInputElement & { files: FileList }
async function uploadFile (screen: Screen, user: UserEvent, file?: File): Promise<HTMLInputElementWithFiles>{
    if(file === undefined){
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

describe('Successful upload', () => {
    const initFeedbackSuccessStr = "init success"
    const successInitFeedback: GetString = async () => { return initFeedbackSuccessStr }

    const feedbackSuccess = "post success"
    const withResolvers = () => {
        let resolve: (value: unknown) => void;
        let reject: (value: unknown) => void;

        const promise = new Promise((res, rej) => {
            resolve = res
            reject = rej
        })

        // @ts-ignore
        if (!resolve || !reject) {
            throw new Error("from withResolvers")
        }

        return { promise, resolve, reject }
    }

    it('renders the component', () => {
        const { promise, resolve, reject } = withResolvers()
        const successPostFile: HandleFileUpload = async () => {
            await promise
        }

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={successInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )
        screen.debug();
    })

    it('shows pending feedback', async () => {
        const { promise, resolve, reject } = withResolvers()
        const successPostFile: HandleFileUpload = async () => {
            await promise
        }

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={successInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )

        const user = userEvent.setup()

        let feedbackPending: HTMLElement | null;
        feedbackPending = screen.queryByText(FEEDBACK_PENDING)
        expect(feedbackPending).toBeNull()

        await uploadFile(screen, user)

        feedbackPending = await screen.findByText(FEEDBACK_PENDING)
        expect(feedbackPending).not.toBeNull()
    })

    // it('shows success feedback', async () => {
    //     const { promise, resolve, reject } = withResolvers()
    //     const successPostFile: HandleFileUpload = async () => {
    //         await promise
    //         return feedbackSuccess
    //     }
    //
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <UploadFileModel
    //                 title='Example'
    //                 getInitFeedback={successInitFeedback}
    //                 postFile={successPostFile}
    //             />
    //         </QueryClientProvider>
    //     )
    //     let feedback: HTMLElement|null;
    //     feedback = screen.queryByText(feedbackSuccess)
    //     expect(feedback).toBeNull()
    //     //change file
    //
    //     resolve()
    //     await screen.findByText(feedbackSuccess)
    // })
    //
    // it('shows error feedback', () => {
    //     const { promise, resolve, reject } = Promise.withResolvers()
    //     const successPostFile: HandleFileUpload = async () => {
    //         await promise
    //         return postFileSuccessStr
    //     }
    //
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <UploadFileModel
    //                 title='Example'
    //                 getInitFeedback={successInitFeedback}
    //                 postFile={successPostFile}
    //             />
    //         </QueryClientProvider>
    //     )
    //     //change file
    // })
})
