import { describe, expect, expectTypeOf, it } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UploadFileModel, { ERROR, PENDING, READY, UNABLE } from './UploadFileModel';
import { PLACEHOLDER } from './UploadFileView';
import { Reject, Resolve, withResolvers } from '@/lib/async';

type HTMLInputElementWithFiles = HTMLInputElement & { files: FileList }

export function uploadFileResolvers() {
    const { promise, resolve, reject } = withResolvers()
    const uploadFile = async () => { return await promise as Promise<string> }

    return { uploadFile, resolve, reject }
}

let resolveUpload: Resolve;
let rejectUpload: Reject;

type SetupRet = {
    controlBtn: HTMLButtonElement,
    fileInput: HTMLInputElement
}

type Setup = () => Promise<SetupRet>

describe('UploadFile', () => {

    function testPhase(phase: string, setup: Setup, inputDisabled: boolean, controlDisabled: boolean) {
        describe(phase, () => {
            it('renders', async () => {
                await setup()
                screen.debug();
            })

            it(`changes to ${phase} phase`, async () => {
                const {
                    controlBtn,
                    fileInput
                } = await setup()

                expectTypeOf(controlBtn).toExtend<HTMLButtonElement>()
                expectTypeOf(fileInput).toExtend<HTMLInputElement>()

                expect(fileInput.disabled === inputDisabled)
                expect(controlBtn.disabled === controlDisabled)
            })

            if (!inputDisabled) {
                it('tab navigate to file input', async () => {
                    const {
                        fileInput
                    } = await setup()

                    const user = userEvent.setup()

                    await waitFor(async () => {
                        await user.tab()
                        expect(document.activeElement).toBe(fileInput)
                    })
                })
            }

            if (!controlDisabled) {
                it('tab navigate to control button', async () => {
                    const {
                        controlBtn
                    } = await setup()

                    const user = userEvent.setup()

                    await waitFor(async () => {
                        await user.tab()
                        expect(document.activeElement).toBe(controlBtn)
                    })
                })
            }

        })
    }

    const queryClient = new QueryClient()

    const loadFile = () => { }

    const setupInit = async () => {
        const resolvers = uploadFileResolvers()
        const { uploadFile, resolve, reject } = resolvers

        render(
            <QueryClientProvider client={queryClient}>
                <UploadFileModel
                    title='Example'
                    loadFile={loadFile}
                    uploadFile={uploadFile}
                    abortUpload={() => { }}
                />
            </QueryClientProvider>
        )

        resolveUpload = resolve
        rejectUpload = reject

        const controlBtn = await screen.findByText(UNABLE) as HTMLButtonElement
        const fileInput = await screen.findByPlaceholderText(PLACEHOLDER) as HTMLInputElement

        return {
            controlBtn,
            fileInput
        }
    }

    describe('init', () => {
        testPhase('init', setupInit, false, true)
    })

    async function setupReady() {
        setupInit()

        const filename = 'hello.png'

        const user = userEvent.setup()
        const fileInput = await screen.findByPlaceholderText(PLACEHOLDER) as HTMLInputElement
        const file = new File(['hello'], filename, { type: 'image/png' })

        await user.upload(fileInput, file)

        const re = new RegExp(filename);

        const controlBtn = await screen.findByText(READY) as HTMLButtonElement
        const fileInputWithFile = await screen.findByDisplayValue(re) as HTMLInputElementWithFiles

        return {
            filename: filename,
            controlBtn: controlBtn,
            fileInput: fileInputWithFile
        }
    }

    describe('ready', () => {
        testPhase('ready', setupReady, false, false)
    })

    async function setupUploading() {
        const {
            filename,
            controlBtn: readyBtn
        } = await setupReady()

        const user = userEvent.setup()

        const re = new RegExp(filename);
        user.click(readyBtn)

        const controlBtn = await screen.findByText(PENDING) as HTMLButtonElement
        const fileInputWithFile = await screen.findByDisplayValue(re) as HTMLInputElementWithFiles

        return {
            filename,
            controlBtn: controlBtn,
            fileInput: fileInputWithFile
        }
    }

    describe('uploading', () => {
        testPhase('uploading', setupUploading, true, false)
    })

    async function setupFailed() {
        const {
            filename,
            controlBtn: uploadingBtn
        } = await setupUploading()

        const user = userEvent.setup()

        const re = new RegExp(filename);
        user.click(uploadingBtn)
        rejectUpload(Error("From test failed phase"))

        const controlBtn = await screen.findByText(ERROR) as HTMLButtonElement
        const fileInputWithFile = await screen.findByDisplayValue(re) as HTMLInputElementWithFiles

        return {
            filename,
            controlBtn: controlBtn,
            fileInput: fileInputWithFile
        }
    }

    describe('failed', () => {
        testPhase('failed', setupFailed, false, false)
    })

    async function setupSucceeded() {
        const {
            filename,
            controlBtn: uploadingBtn
        } = await setupUploading()

        const user = userEvent.setup()

        const re = new RegExp(filename);
        user.click(uploadingBtn)

        const successMsg = "Yippie"
        resolveUpload(successMsg)

        const controlBtn = await screen.findByText(successMsg) as HTMLButtonElement
        const fileInputWithFile = await screen.findByDisplayValue(re) as HTMLInputElementWithFiles

        return {
            filename,
            controlBtn: controlBtn,
            fileInput: fileInputWithFile
        }
    }

    describe('succeeded', () => {
        testPhase('succeeded', setupSucceeded, false, false)
    })

})
