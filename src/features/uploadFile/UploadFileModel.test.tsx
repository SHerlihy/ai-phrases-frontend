import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadFileModel, { GetString, HandleFileUpload } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { uploadFile } from './UploadFileModelTest';
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
                    uploadFile={successPostFile}
                    abortUpload={() => { }}
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
                    uploadFile={successPostFile}
                    abortUpload={() => { }}
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

    it('tab navigate to control button', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={successInitFeedback}
                    uploadFile={successPostFile}
                    abortUpload={() => { }}
                />
            </QueryClientProvider>
        )
        const user = userEvent.setup()

        const controlButton = await screen.findByRole("button")

        while (controlButton !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(controlButton)
    })
})
