import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import UploadFileModel, { FEEDBACK_ERROR, FEEDBACK_PENDING, HandleFileUpload } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LABEL_TEXT } from '@/components/UploadInput';
import { getInitFeedbackResolvers } from './UploadFileModelTest';

describe('Init feedback', () => {

    const successPostFile: HandleFileUpload = async () => { return "from post" }

    const setupPending = () => {
        const queryClient = new QueryClient()
        const { getInitFeedback, resolve, reject } = getInitFeedbackResolvers()

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={getInitFeedback}
                    uploadFile={successPostFile}
                    abortUpload={() => { }}
                />
            </QueryClientProvider>
        )

        return { getInitFeedback, resolve, reject }
    }

    describe('from init pending', () => {

        const setup = () => {
            return setupPending()
        }

        it('shows pending feedback', async () => {

            const { getInitFeedback, resolve, reject } = setup()

            await screen.findByText(FEEDBACK_PENDING)

        })

        it('upload enabled', async () => {

            const { getInitFeedback, resolve, reject } = setup()

            const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
            expect(fileInput.disabled === false)

        })


    })

    describe("from error", () => {
        const setup = () => {
            const { getInitFeedback, resolve, reject } = setupPending()

            act(() => {
                reject(new Error("Forced error"))
            })

            return { getInitFeedback, resolve, reject }
        }

        it('upload enabled', async () => {

            const { getInitFeedback, resolve, reject } = setup()

            const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
            expect(fileInput.disabled === false)

        })

        it('shows error feedback', async () => {
            const findRegexp = new RegExp(FEEDBACK_ERROR)

            const { getInitFeedback, resolve, reject } = setup()

            act(() => {
                reject(new Error("Forced error"))
            })

            screen.findByText(findRegexp)
        })
    })

    describe("from success", () => {

        const successStr = "Success in test"

        const setup = () => {
            const { getInitFeedback, resolve, reject } = setupPending()

            act(() => {
                resolve(successStr)
            })

            return { getInitFeedback, resolve, reject }
        }

        it('shows success feedback', async () => {
            const findRegexp = new RegExp(successStr)

            const { getInitFeedback, resolve, reject } = setup()


            screen.findByText(findRegexp)
        })

        it('upload enabled', async () => {

            const { getInitFeedback, resolve, reject } = setup()

            const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
            expect(fileInput.disabled === false)

        })

    })

})
