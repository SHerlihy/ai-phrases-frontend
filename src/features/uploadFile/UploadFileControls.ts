import { ChangeEvent } from "react";
import { GetString } from "./UploadFileModel";
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
    uploadFile: (e: ChangeEvent<HTMLInputElement>) => Promise<string>
    abortFileUpload: (reason?: any) => void
    getFilename: GetString
}

class UploadFileControls implements IUploadFileControls {
    controller = new AbortController()

    baseUrl: string;

    constructor(baseUrl: string) { this.baseUrl = baseUrl }

    uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files === null) {
            new Error(`No file to upload`)
        }

        const formData = new FormData();
        const file = files![0]

        formData.append('file', file);

        const response = await this.uploadFileRequest(formData)

        if (response.status !== 200) {
            throw new Error(`Upload file status: ${response.status}`)
        }

        return file.name
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
        if (import.meta.env.DEV) {
            return await this.getFilenameRequestDev()
        }

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

        return await fetch(this.baseUrl, {
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

        await new Promise(r => setTimeout(r, 2000));


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

        if (this.controller.signal.aborted) {
            return failResponse
        }

        const rnd = Math.random()

        if (rnd > 0.5) {
            return failResponse
        }

        return successResponse
    }

    uploadFileRequestProd = async (formData: FormData) => {

        return await fetch(this.baseUrl,
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                mode: "cors",
                signal: this.controller.signal,
                body: formData
            }
        )
    }

}

export default UploadFileControls
