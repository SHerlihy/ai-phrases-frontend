import { beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadFileModel, { FEEDBACK_ERROR, FEEDBACK_PENDING } from './UploadFileModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LABEL_TEXT } from '@/components/UploadInput';
import { getInitFeedbackResolvers, getUploadResolvers, uploadFile } from './UploadFileModelTest';


const successInit = "SUCCESS ON INIT"
const abortMessage = "ABORT CALLED"

describe('Uploading', () => {

    const setupPending = () => {
        const queryClient = new QueryClient()
        const { getInitFeedback, resolve: initResolve, reject: initReject } = getInitFeedbackResolvers()
        const { handleFileUpload, resolve, reject } = getUploadResolvers()

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    getInitFeedback={() => { return Promise.resolve(successInit) }}
                    uploadFile={handleFileUpload}
                    abortUpload={() => { reject(new Error(abortMessage)) }}
                />
            </QueryClientProvider>
        )

        return {
            init: { getInitFeedback, initResolve, initReject },
            upload: { handleFileUpload, resolve, reject }
        }
    }

    describe('from init success', () => {

        const initSuccess = "Init Success"

        const setupInitSuccess = () => {

            const {
                init: { getInitFeedback, initResolve, initReject },
                upload: { handleFileUpload, resolve, reject }
            } = setupPending()

            act(() => {
                initResolve(initSuccess)
            })

            return { handleFileUpload, resolve, reject }
        }

        describe('upload pending', () => {
            let handleFileUpload
            let resolve
            let reject

            beforeEach(async () => {
                const setupRet = setupInitSuccess()

                const user = userEvent.setup()
                await act(async () => {
                    await uploadFile(screen, user)
                })

                handleFileUpload = setupRet.handleFileUpload
                resolve = setupRet.resolve
                reject = setupRet.reject
            })

            it('disables input', async () => {

                const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
                expect(fileInput.disabled === true)

            })

            it('shows pending', async () => {

                await screen.findByText(FEEDBACK_PENDING)

            })
        })

        describe('upload error', () => {
            const uploadError = "upload error"
            let handleFileUpload
            let resolve
            let reject

            beforeEach(async () => {
                const setupRet = setupInitSuccess()

                const user = userEvent.setup()
                await act(async () => {
                    await uploadFile(screen, user)
                })

                act(() => {
                    setupRet.reject(new Error(uploadError))
                })

                handleFileUpload = setupRet.handleFileUpload
                resolve = setupRet.resolve
                reject = setupRet.reject
            })

            it('enables input', async () => {

                const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
                expect(fileInput.disabled === false)

            })

            it('shows error', async () => {

                await screen.findByText(FEEDBACK_ERROR)

            })
        })

        describe('upload abort', () => {
            let handleFileUpload
            let resolve
            let reject

            beforeEach(async () => {
                const setupRet = setupInitSuccess()

                const user = userEvent.setup()
                await act(async () => {
                    await uploadFile(screen, user)
                })

                const controlButton = await screen.findByText(FEEDBACK_PENDING)
                act(() => {
                    user.click(controlButton)
                })

                handleFileUpload = setupRet.handleFileUpload
                resolve = setupRet.resolve
                reject = setupRet.reject
            })

            it('enables input', async () => {

                const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
                expect(fileInput.disabled === false)

            })

            it('shows error', async () => {

                await screen.findByText(FEEDBACK_ERROR)

            })
        })

        describe('upload success', () => {

            const uploadSuccess = "upload success"

            let handleFileUpload
            let resolve
            let reject

            beforeEach(async () => {
                const setupRet = setupInitSuccess()

                const user = userEvent.setup()
                await act(async () => {
                    await uploadFile(screen, user)
                })

                act(() => {
                    setupRet.resolve(uploadSuccess)
                })

                handleFileUpload = setupRet.handleFileUpload
                resolve = setupRet.resolve
                reject = setupRet.reject
            })

            it('enables input', async () => {

                const fileInput = await screen.findByLabelText(LABEL_TEXT) as HTMLInputElement
                expect(fileInput.disabled === false)

            })

            it('shows success', async () => {

                await screen.findByText(uploadSuccess)

            })
        })
    })

})

