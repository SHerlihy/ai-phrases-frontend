import { ChangeEvent } from "react";
import { GetString } from "./UploadFileModel";
import { xml2json } from "xml-js";

type Contents = {
    Key: string,
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

    async uploadFile(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (files === null) {
            new Error(`No file to upload`)
        }

        const formData = new FormData();
        const file = files![0]

        formData.append('file', file);

        const response = await fetch(this.baseUrl,
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

        if (response.status !== 200) {
            throw new Error(`Upload file status: ${response.status}`)
        }

        return file.name
    }

    abortFileUpload(reason?: any) {
        this.controller.abort(reason)
    }

    async getFilename() {
        const response = await fetch(this.baseUrl, {
            method: "GET",
            mode: "cors",
            signal: this.controller.signal
        })

        if (response.status !== 200) {
            throw new Error("Unable to list bucket objects")
        }

        const xmlStr = await response.text()

        const listObj = JSON.parse(xml2json(xmlStr, options)) as ListBucketResponse
        let contents = listObj.ListBucketResult.Contents;
        if (!Array.isArray(contents)) {
            contents = [contents]
        }

        return contents[0].Key
    }
}

export default UploadFileControls
