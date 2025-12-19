import UploadFileControls from "../uploadFile/UploadFileControls"
import UploadFileModel from "../uploadFile/UploadFileModel"

const uploadFileControls = new UploadFileControls("")

const UploadPhrases = () => {
    return (
        <UploadFileModel
            title='Phrases'
            getInitFeedback={uploadFileControls.getFilename}
            postFile={uploadFileControls.postFile}
        />
    )
}

export default UploadPhrases
