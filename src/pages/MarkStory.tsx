import ParameterInput from '@/components/ParameterInput'
import QueryStoryModel from '@/features/queryStory/QueryStoryModel'
import UploadFileModel from '@/features/uploadFile/UploadFileModel'

const MarkStory = () => {
    return (
        <>
            <ParameterInput />
            <UploadFileModel
                title="Phrases"
                getInitFeedback={() => Promise.resolve("init")}
                postFile={(e) => Promise.resolve("upload")}
            />
            <QueryStoryModel
                postMarkStory={(e) => Promise.resolve([undefined, "marked"])}
            />
        </>
    )
}

export default MarkStory
