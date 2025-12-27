import ParamInput from '@/features/paramInput/ParamInput'
import ParamStore from '@/features/paramInput/ParamStore'
import QueryStoryControl from '@/features/queryStory/QueryStoryControl'
import QueryStoryModel from '@/features/queryStory/QueryStoryModel'
import { HandleSubmit } from '@/features/queryStory/QueryStoryView'
import UploadFileControls from '@/features/uploadFile/UploadFileControls'
import UploadFileModel from '@/features/uploadFile/UploadFileModel'

const BUCKET_URL = ""
const POST_QUERY_URL = ""
const { setParam, getParam } = new ParamStore()
const getKey = () => {
    return getParam("key")
}

const MarkStory = () => {
    const { uploadFile, abortFileUpload, getFilename } = new UploadFileControls(BUCKET_URL)
    const { postQuery, demarshall, abortQuery } = new QueryStoryControl(POST_QUERY_URL, getKey)

    const handlePostMarkStory: HandleSubmit = async (story) => {
        const [error, response] = await postQuery(story)

        if (error) {
            throw error
        }

        return await demarshall(response)
    }

    return (
        <>
            <ParamInput title={"key"} setParam={setParam} />
            <UploadFileModel
                title="Phrases"
                getInitFeedback={getFilename}
                postFile={uploadFile}
                abortUpload={abortFileUpload}
            />
            <QueryStoryModel
                postMarkStory={handlePostMarkStory}
                abortMarkStory={abortQuery}
            />
        </>
    )
}

export default MarkStory
