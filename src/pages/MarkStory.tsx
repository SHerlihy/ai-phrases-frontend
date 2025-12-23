import ParamInput from '@/features/paramInput/ParamInput'
import ParamStore from '@/features/paramInput/ParamStore'
import QueryStoryControl from '@/features/queryStory/QueryStoryControl'
import QueryStoryModel from '@/features/queryStory/QueryStoryModel'
import UploadFileModel from '@/features/uploadFile/UploadFileModel'

const { setParam, getParam } = new ParamStore()
const getKey = () => {
    return getParam("key")
}

const MarkStory = () => {
    const { postQuery, abortQuery } = new QueryStoryControl(getKey)

    return (
        <>
            <ParamInput title={"key"} setParam={setParam} />
            <UploadFileModel
                title="Phrases"
                getInitFeedback={() => Promise.resolve("init")}
                postFile={(e) => Promise.resolve("upload")}
            />
            <QueryStoryModel
                postMarkStory={postQuery}
                abortMarkStory={abortQuery}
            />
        </>
    )
}

export default MarkStory
