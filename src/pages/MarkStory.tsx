import ParamInput from '@/features/paramInput/ParamInput'
import ParamStore from '@/features/paramInput/ParamStore'
import UploadFileControls from '@/features/uploadFile/UploadFileControls'
import UploadFileModel from '@/features/uploadFile/UploadFileModel'

import QueryStoryControl from '@/features/queryStory/QueryStoryControl'
import QueryStoryModel from '@/features/queryStory/QueryStoryModel'
import { catchError } from '@/lib/async'


const BUCKET_URL = "https://z4l050ugd2.execute-api.us-east-1.amazonaws.com/main/kbaas/"

const { setParam, getParam } = new ParamStore()

const getKey = () => {
    return getParam("key")
}

const { loadFile, uploadFile, abortFileUpload, getFilename } = new UploadFileControls(BUCKET_URL, getKey)

const POST_QUERY_URL = `${BUCKET_URL}query/`
const { postQuery, demarshall, abortQuery } = new QueryStoryControl(POST_QUERY_URL, getKey)

const MarkStory = () => {

    const handlePostMarkStory = async (story: string) => {
        const [error, response] = await catchError(postQuery(story))

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
                loadFile={loadFile}
                uploadFile={uploadFile}
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
