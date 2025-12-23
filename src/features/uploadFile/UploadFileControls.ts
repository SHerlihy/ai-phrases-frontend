import { ChangeEvent } from "react";
import { GetString, HandleFileUpload } from "./UploadFileModel";

const options = {
    compact: true
};

interface IUploadFileControls {
    postFile: HandleFileUpload,
    getFilename: GetString
}

class UploadFileControls implements IUploadFileControls {
    baseUrl;

    constructor(baseUrl: string) { this.baseUrl = baseUrl }

    async postFile(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (files === null) {
            return ""
        }

        const formData = new FormData();
        formData.append('file', files[0]);

        const response = await fetch(this.baseUrl,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            }
        )
        //xml to json
        if (response.status === 204) { return files[0].name }

        return "Failure"
    }

    async getFilename() {
        const response = await fetch(this.baseUrl)
        //xml to json
        if (!response || !response.body) {
            return ""
        }

        const listObj = JSON.parse(xml2json(response.body, options))
        let contents = listObj.ListBucketResult.Contents;
        if (!Array.isArray(contents)) {
            contents = [contents]
        }

        return contents[0].Key._text
    }

}

export default UploadFileControls
