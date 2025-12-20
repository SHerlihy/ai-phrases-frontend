import { describe, expect, it } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadFileModel, { FEEDBACK_PENDING, HandleFileUpload } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LABEL_TEXT } from '@/components/UploadInput';
import { getInitFeedbackResolvers, getUploadResolvers, uploadFile } from './UploadFileModelTest';

describe('Upload enabled', () => {
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
    it('is enabled when init pending', async () => {

        const successPostFile: HandleFileUpload = async () => { return "from post" }
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

    it('is disabled when upload pending', async () => {

        const { resolve, reject } = await renderInitSuccess()
        const findRegexp = new RegExp(FEEDBACK_PENDING)

        const user = userEvent.setup()
        await act(async () => {
            await uploadFile(screen, user)
        })

        await screen.findByText(findRegexp)

        const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
        expect(fileInput.disabled === true)

    })
})

