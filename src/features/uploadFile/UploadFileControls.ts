import { ChangeEvent } from "react";

interface IUploadFileControls {
    loadFile: (e: ChangeEvent<HTMLInputElement>) => void
    uploadFile: () => Promise<string>
    abortFileUpload: (reason?: any) => void
}

class UploadFileControls implements IUploadFileControls {
    controller = new AbortController()

    bucketUrl: string;
    phrasesUrl: string;
    syncUrl: string;

    getAuthKey: () => string;

    file: File | null = null;

    constructor(bucketUrl: string, getAuthKey: () => string) {
        this.bucketUrl = bucketUrl
        this.phrasesUrl = `${this.bucketUrl}phrases/`
        this.syncUrl = `${this.bucketUrl}sync/`

        this.getAuthKey = getAuthKey
    }

    getPhrasesUrl = () => {
        return `${this.phrasesUrl}?authKey=${this.getAuthKey()}`
    }

    getSyncUrl = () => {
        return `${this.syncUrl}?authKey=${this.getAuthKey()}`
    }

    loadFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files === null) {
            new Error(`No file to upload`)
        }

        this.file = files![0]
    }

    uploadFile = async () => {

        this.controller = new AbortController()

        if (this.file === null) {
            throw new Error(`No file to upload`)
        }

        const response = await this.uploadFileRequest(this.file)

        if (response.status !== 200) {
            throw new Error(`Upload file status: ${response.status}`)
        }

        const filename = this.file.name
        this.file = null

        return filename
    }

    abortFileUpload = (reason?: any) => {
        this.controller.abort(reason)
    }

    uploadFileRequest = async (file: File): Promise<Response> => {
        if (import.meta.env.PROD) {
            return await this.uploadFileRequestProd(file)
        }

        return await this.uploadFileRequestDev()
    }

    uploadFileRequestDev = async () => {

        await Promise.race([
            new Promise(resolve => setTimeout(resolve, 2000)),
            new Promise((_, reject) =>
                this.controller.signal.onabort = () => {
                    reject(new Error("Upload aborted"))
                }
            ),
        ])

        const failOpts = {
            status: 400,
            statusText: "Error"
        }

        const successOpts = {
            status: 200,
            satusText: "Upload complete"
        }

        const failResponse = new Response("", failOpts)

        const successResponse = new Response("Uploaded file name", successOpts)

        const rnd = Math.random()

        if (rnd > 0.5) {
            return failResponse
        }

        return successResponse
    }

    uploadFileRequestProd = async (file: File) => {

        const uploadResponse = await fetch(this.getPhrasesUrl(),
            {
                method: "PUT",
                headers: {
                    'Content-Type': file.type
                },
                mode: "cors",
                signal: this.controller.signal,
                body: file
            }
        )

        // really calling it anyway?
        await fetch(this.getSyncUrl(),
            {
                method: "PATCH",
                mode: "cors",
                signal: this.controller.signal
            }
        )

        return uploadResponse
    }

}

export default UploadFileControls
