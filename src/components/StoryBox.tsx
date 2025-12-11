import { Textarea } from "./ui/textarea"

type Props = {
    story: string
}

const StoryBox = ({ story }: Props) => {
    return (
        <Textarea
            placeholder="Paste your story here :)"
        >
            {story}
        </Textarea>
    )
}

export default StoryBox
