import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import UploadFileModel, { FEEDBACK_ERROR, FEEDBACK_PENDING, HandleFileUpload } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LABEL_TEXT } from '@/components/UploadInput';
import { getInitFeedbackResolvers } from './UploadFileModelTest';

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

    it('upload enabled when init pending', async () => {

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

        const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
        expect(fileInput.disabled === false)

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

