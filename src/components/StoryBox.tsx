import { Textarea } from "./ui/textarea"

type Props = {
    story: string
}

const StoryBox = ({ story }: Props) => {
    return (
        <Textarea
            placeholder="Paste your story here :)"
            className={"h-full"}
        >
            {story}
        </Textarea>
    )
}

export default StoryBox
