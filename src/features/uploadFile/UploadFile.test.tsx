import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

type Resolve = (value: string) => void
type Reject = (value: Error) => void
const withResolvers = () => {
    let resolve: Resolve;
    let reject: Reject;

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

        await screen.findByText(FEEDBACK_PENDING)

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

        act(() => {
            reject(new Error("Forced error"))
        })

        screen.findByText(findRegexp)
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

        act(() => {
            resolve(successStr)
        })

        screen.findByText(findRegexp)
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

        async function renderInitSuccess() {

            const successInit = "SUCCESS ON INIT"

            const queryClient = new QueryClient()
            const { handleFileUpload, resolve, reject } = getUploadResolvers()

            render(
                <QueryClientProvider client={queryClient}>
                    <UploadFileModel
                        title='Example'
                        getInitFeedback={() => { return Promise.resolve(successInit) }}
                        postFile={handleFileUpload}
                    />
                </QueryClientProvider>
            )

            await waitFor(() => {
                const feedback = screen.queryByText(new RegExp(successInit))
                expect(feedback).not.toBeNull()
            })

            return { resolve, reject }

        }

        it('shows success', async () => {

            const { resolve, reject } = await renderInitSuccess()

            const successPost = "SUCCESS ON POST"
            const findRegexp = new RegExp(successPost)

            const user = userEvent.setup()

            await act(async () => {
                await uploadFile(screen, user)
            })

            act(() => {
                resolve!(successPost)
            })

            await screen.findByText(findRegexp)

        })

        it('shows error', async () => {

            const { resolve, reject } = await renderInitSuccess()

            const findRegexp = new RegExp(FEEDBACK_ERROR)

            const user = userEvent.setup()
            await act(async () => {
                await uploadFile(screen, user)
            })

            act(() => {
                reject(new Error("From upload file show error"))
            })

            await screen.findByText(findRegexp)

        })

        it('shows pending', async () => {

            const { resolve, reject } = await renderInitSuccess()
            const findRegexp = new RegExp(FEEDBACK_PENDING)

            const user = userEvent.setup()
            await act(async () => {
                await uploadFile(screen, user)
            })

            await screen.findByText(findRegexp)
        })

    })

})

describe.only('Confirm feedback', () => {

    async function renderInitSuccess() {
        const initStr = "Success init"
        const queryClient = new QueryClient()
        const { getInitFeedback, resolve: initResolve } = getInitFeedbackResolvers()
        const { handleFileUpload, resolve, reject } = getUploadResolvers()

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={getInitFeedback}
                    postFile={handleFileUpload}
                />
            </QueryClientProvider>
        )

        act(() => {
            initResolve(initStr)
        })

        await screen.findByText(initStr)

        return { resolve, reject }
    }

    it('disables feedback button on upload', async () => {

        const findRegexp = new RegExp(FEEDBACK_PENDING)

        const { resolve, reject } = await renderInitSuccess()
        

        const user = userEvent.setup()
        await act(async () => {
            await uploadFile(screen, user)
        })

        await waitFor(async () => {
            const feedback: HTMLButtonElement = await screen.findByText(findRegexp)
            expect(feedback.disabled === true)
        })

    })

    it('enables feedback button on uploaded', async () => {

        const uploadSuccess = "uploadSuccess"
        const findRegexp = new RegExp(uploadSuccess)

        const { resolve, reject } = await renderInitSuccess()

        const user = userEvent.setup()
        await act(async () => {
            await uploadFile(screen, user)
        })

        act(() => {
            resolve(uploadSuccess)
        })

        await waitFor(async () => {
            const feedback: HTMLButtonElement = await screen.findByText(findRegexp)
            expect(feedback.disabled === false)
        })

    })

    it('enables feedback button on error', async () => {

        const uploadStr = "uploadError"
        const findRegexp = new RegExp(uploadStr)

        const { resolve, reject } = await renderInitSuccess()

        const user = userEvent.setup()
        await act(async () => {
            await uploadFile(screen, user)
        })

        act(() => {
            reject(new Error(uploadStr))
        })

        await waitFor(async () => {
            const feedback: HTMLButtonElement = await screen.findByText(findRegexp)
            expect(feedback.disabled === false)
        })

    })

})
