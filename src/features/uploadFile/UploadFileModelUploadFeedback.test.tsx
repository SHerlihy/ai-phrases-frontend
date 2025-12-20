import { describe, expect, it } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadFileModel, { FEEDBACK_ERROR, FEEDBACK_PENDING, } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getInitFeedbackResolvers, getUploadResolvers, uploadFile } from './UploadFileModelTest';


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

describe('Confirm feedback', () => {

    describe('from init pending', () => {

        async function renderInitPending() {

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

            await screen.findByText(FEEDBACK_PENDING)

            return { resolve, reject }
        }

        it('disables feedback button on upload', async () => {

            const findRegexp = new RegExp(FEEDBACK_PENDING)

            const { resolve, reject } = await renderInitPending()

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

            const { resolve, reject } = await renderInitPending()

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
            const findRegexp = new RegExp(FEEDBACK_ERROR)

            const { resolve, reject } = await renderInitPending()

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

    describe('from init success', () => {
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
            const findRegexp = new RegExp(FEEDBACK_ERROR)

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

})
