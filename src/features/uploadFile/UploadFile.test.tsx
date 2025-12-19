import { describe, expect, it } from 'vitest';
import { act, render, Screen, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import UploadFileModel, { FEEDBACK_ERROR, FEEDBACK_PENDING, GetString, HandleFileUpload } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LABEL_TEXT } from '@/components/UploadInput';

describe('UploadPhrases', () => {
    const queryClient = new QueryClient()
    const initFeedbackSuccessStr = "init success"
    const successInitFeedback: GetString = async () => { return initFeedbackSuccessStr }

    const successPostFile: HandleFileUpload = async () => { return "from post" }
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

const withResolvers = () => {
    let resolve: (value: string) => void;
    let reject: (value: Error) => void;

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

function getInitFeedbackResolvers() {
    const { promise, resolve, reject } = withResolvers()
    const getInitFeedback: GetString = async () => { return await promise as Promise<string> }

    return { getInitFeedback, resolve, reject }
}

describe('Init feedback', () => {

    const successPostFile: HandleFileUpload = async () => { return "from post" }

    it('shows pending feedback', async () => {

        const queryClient = new QueryClient()
        const { getInitFeedback } = getInitFeedbackResolvers()

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={getInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )

        let feedbackPending: HTMLElement | null;

        feedbackPending = await screen.findByText(FEEDBACK_PENDING)
        expect(feedbackPending).not.toBeNull()

    })

    it('shows error feedback', async () => {
        const findRegexp = new RegExp(FEEDBACK_ERROR)
        const queryClient = new QueryClient()
        const { getInitFeedback, reject } = getInitFeedbackResolvers()

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={getInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )

        let feedback: HTMLElement | null;
        feedback = screen.queryByText(findRegexp)
        expect(feedback).toBeNull()

        act(() => {
            reject(new Error("Forced error"))
        })

        await waitFor(() => {
            feedback = screen.queryByText(findRegexp)
            expect(feedback).not.toBeNull()
        })
    })

    it('shows success feedback', async () => {
        const successStr = "Success in test"
        const findRegexp = new RegExp(successStr)
        const queryClient = new QueryClient()
        const { getInitFeedback, resolve } = getInitFeedbackResolvers()

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={getInitFeedback}
                    postFile={successPostFile}
                />
            </QueryClientProvider>
        )

        let feedback: HTMLElement | null;
        feedback = screen.queryByText(findRegexp)
        expect(feedback).toBeNull()

        act(() => {
            resolve(successStr)
        })

        await waitFor(() => {
            feedback = screen.queryByText(findRegexp)
            expect(feedback).not.toBeNull()
        })
    })
})

type HTMLInputElementWithFiles = HTMLInputElement & { files: FileList }
async function uploadFile(screen: Screen, user: UserEvent, file?: File): Promise<HTMLInputElementWithFiles> {
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

function getUploadResolvers() {
    const { promise, resolve, reject } = withResolvers()
    const handleFileUpload: HandleFileUpload = async () => { return await promise as Promise<string> }

    return { handleFileUpload, resolve, reject }
}

describe('Upload feedback', () => {

    describe('from init feedback success', () => {

        it('shows success', async () => {

            const successInit = "SUCCESS ON INIT"
            const successPost = "SUCCESS ON POST"

            const findRegexp = new RegExp(successPost)
            const queryClient = new QueryClient()
            const { handleFileUpload, resolve } = getUploadResolvers()

            act(() => {

                render(
                    <QueryClientProvider client={queryClient}>
                        <UploadFileModel
                            title='Example'
                            getInitFeedback={() => { return Promise.resolve(successInit) }}
                            postFile={handleFileUpload}
                        />
                    </QueryClientProvider>
                )

            })

            let feedback: HTMLElement | null;
            await waitFor(() => {
                feedback = screen.queryByText(new RegExp(successInit))
                expect(feedback).not.toBeNull()
            })

            const user = userEvent.setup()

            act(() => {
                uploadFile(screen, user)
            })

            act(() => {
                resolve(successPost)
            })

            await waitFor(() => {
                feedback = screen.queryByText(findRegexp)
                expect(feedback).not.toBeNull()
            })

        })

        it('shows error', async () => {

            const successStr = "SUCCESS ON INIT"
            const findRegexp = new RegExp(FEEDBACK_ERROR)
            const queryClient = new QueryClient()
            const { handleFileUpload, reject } = getUploadResolvers()

            act(() => {

                render(
                    <QueryClientProvider client={queryClient}>
                        <UploadFileModel
                            title='Example'
                            getInitFeedback={() => { return Promise.resolve(successStr) }}
                            postFile={handleFileUpload}
                        />
                    </QueryClientProvider>
                )

            })

            let feedback: HTMLElement | null;
            await waitFor(() => {
                feedback = screen.queryByText(new RegExp(successStr))
                expect(feedback).not.toBeNull()

            })

            const user = userEvent.setup()
            act(() => {
                uploadFile(screen, user)
            })

            act(() => {
                reject(new Error("From upload file show error"))
            })

            await waitFor(() => {
                feedback = screen.queryByText(findRegexp)
                expect(feedback).not.toBeNull()
            })

        })

        it('shows pending', async () => {

            const successStr = "SUCCESS ON INIT"
            const findRegexp = new RegExp(FEEDBACK_PENDING)
            const queryClient = new QueryClient()
            const { handleFileUpload } = getUploadResolvers()

            act(() => {

                render(
                    <QueryClientProvider client={queryClient}>
                        <UploadFileModel
                            title='Example'
                            getInitFeedback={() => { return Promise.resolve(successStr) }}
                            postFile={handleFileUpload}
                        />
                    </QueryClientProvider>
                )

            })

            let feedback: HTMLElement | null;
            await waitFor(() => {
                feedback = screen.queryByText(new RegExp(successStr))
                expect(feedback).not.toBeNull()

            })

            const user = userEvent.setup()
            act(() => {
                uploadFile(screen, user)
            })

            await waitFor(() => {
                feedback = screen.queryByText(findRegexp)
                expect(feedback).not.toBeNull()
            })

        })

    })

})
