import { ChangeEvent } from "react";
import { xml2json } from "xml-js";

type Contents = {
    Key: { _text: string },
    LastModified: Date,
    ETag: string,
    Size: number,
    StorageClass: string
}

type ListBucketResponse = {
    ListBucketResult: {
        Name: string,
        Prefix: string,
        KeyCount: number,
        MaxKeys: number,
        IsTruncated: boolean,
        Contents: Contents[]
    }
}

const options = {
    compact: true
};

interface IUploadFileControls {
    loadFile: (e: ChangeEvent<HTMLInputElement>) => void
    uploadFile: () => Promise<string>
    abortFileUpload: (reason?: any) => void
    getFilename: () => Promise<string>
}

class UploadFileControls implements IUploadFileControls {
    controller = new AbortController()

    bucketUrl: string;
    listUrl: string;
    phrasesUrl: string;

    getAuthKey: () => string;

    file: File | null = null;

    constructor(bucketUrl: string, getAuthKey: () => string) {
        this.bucketUrl = bucketUrl
        this.listUrl = `${this.bucketUrl}list/`
        this.phrasesUrl = `${this.bucketUrl}phrases/`

        this.getAuthKey = getAuthKey
    }

    getListUrl = () => {
        return `${this.listUrl}?authKey=${this.getAuthKey()}`
    }

    getPhrasesUrl = () => {
        return `${this.phrasesUrl}?authKey=${this.getAuthKey()}`
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

        const formData = new FormData();
        formData.append('file', this.file);

        const response = await this.uploadFileRequest(formData)

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

    getFilename = async () => {

        const response = await this.getFilenameRequest()

        if (response.status !== 200) {
            throw new Error("Unable to list bucket objects")
        }

        const xmlStr = await response.text()

        const listObj = JSON.parse(xml2json(xmlStr, options)) as ListBucketResponse
        let contents = listObj.ListBucketResult.Contents;
        if (!Array.isArray(contents)) {
            contents = [contents]
        }

        return contents[0].Key._text
    }

    getFilenameRequest = async () => {
        // if (import.meta.env.DEV) {
        //     return await this.getFilenameRequestDev()
        // }

        return await this.getFilenameRequestProd()
    }

    getFilenameRequestDev = async () => {

        await new Promise(r => setTimeout(r, 2000));

        const successOpts = {
            status: 200,
            satusText: "Init complete"
        }

        const body = `<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Name>docs20251208092312443700000001</Name><Prefix></Prefix><Marker></Marker><MaxKeys>1000</MaxKeys><IsTruncated>false</IsTruncated><Contents><Key>test</Key><LastModified>2025-12-08T09:23:14.000Z</LastModified><ETag>&quot;6f60928828f542d580e1c351d5a7f1d6&quot;</ETag><ChecksumAlgorithm>CRC32</ChecksumAlgorithm><ChecksumType>FULL_OBJECT</ChecksumType><Size>18</Size><Owner><ID>78bfabc0437c878363bcf10ecff51bdfada2cf453437923e11c249d047ca5da9</ID></Owner><StorageClass>STANDARD</StorageClass></Contents></ListBucketResult>`

        const successResponse = new Response(body, successOpts)

        return successResponse
    }

    getFilenameRequestProd = async () => {

        return await fetch(this.getListUrl(), {
            method: "GET",
            mode: "cors",
            signal: this.controller.signal
        })

    }


    uploadFileRequest = async (formData: FormData): Promise<Response> => {
        if (import.meta.env.DEV) {
            return await this.uploadFileRequestDev()
        }

        return await this.uploadFileRequestProd(formData)
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

    uploadFileRequestProd = async (formData: FormData) => {

        return await fetch(this.getPhrasesUrl(),
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                mode: "cors",
                signal: this.controller.signal,
                body: formData
            }
        )
    }

}

export default UploadFileControls
