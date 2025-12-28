import ParamInput from '@/features/paramInput/ParamInput'
import ParamStore from '@/features/paramInput/ParamStore'
import QueryStoryControl from '@/features/queryStory/QueryStoryControl'
import QueryStoryModel from '@/features/queryStory/QueryStoryModel'
import UploadFileControls from '@/features/uploadFile/UploadFileControls'
import UploadFileModel from '@/features/uploadFile/UploadFileModel'
import { catchError } from '@/lib/async'

const BUCKET_URL = "https://32th7r2f0h.execute-api.eu-west-2.amazonaws.com/main/docs20251227222148605600000001/"
const POST_QUERY_URL = ""

const { setParam, getParam } = new ParamStore()

const getKey = () => {
    return getParam("key")
}

const { loadFile, uploadFile, abortFileUpload, getFilename } = new UploadFileControls(BUCKET_URL, getKey)
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
        </>
    )

}

            // <QueryStoryModel
            //     postMarkStory={handlePostMarkStory}
            //     abortMarkStory={abortQuery}
            // />
export default MarkStory
