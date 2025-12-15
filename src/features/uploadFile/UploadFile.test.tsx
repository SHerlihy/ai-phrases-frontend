import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadFileModel, { GetString, HandleFileUpload } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LABEL_TEXT } from '@/components/UploadButton';

const queryClient = new QueryClient()

describe('UploadPhrases', () => {
    const initFeedbackSuccessStr = "init success"
    const successInitFeedback: GetString = async () => { return initFeedbackSuccessStr }

    const postFileSuccessStr = "post success"
    const successPostFile: HandleFileUpload = async () => { return postFileSuccessStr }
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
})

describe('Successful upload', () => {
    const initFeedbackSuccessStr = "init success"
    const successInitFeedback: GetString = async () => { return initFeedbackSuccessStr }

    const postFileSuccessStr = "post success"
    it('renders the component', () => {
        const { promise, resolve, reject } = Promise.withResolvers()
        const successPostFile: HandleFileUpload = async () => {
            await promise
            return postFileSuccessStr
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

    it('shows pending feedback', () => {
        const { promise, resolve, reject } = Promise.withResolvers()
        const successPostFile: HandleFileUpload = async () => {
            await promise
            return postFileSuccessStr
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
        //change file
    })

    it('shows success feedback', () => {
        const { promise, resolve, reject } = Promise.withResolvers()
        const successPostFile: HandleFileUpload = async () => {
            await promise
            return postFileSuccessStr
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
        //change file
    })

    it('shows error feedback', () => {
        const { promise, resolve, reject } = Promise.withResolvers()
        const successPostFile: HandleFileUpload = async () => {
            await promise
            return postFileSuccessStr
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
        //change file
    })
})
