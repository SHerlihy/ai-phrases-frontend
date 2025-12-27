import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import StoryField from './components/StoryField'
import ControlButton, { Props as PropsControlButton } from '@/components/controlButton/ControlButton'

const storySchema = z.object({
    story: z.string()
})

type FormSchema = z.infer<typeof storySchema>
export const formDefaults: FormSchema = {
    story: ""
}

type Props = {
    defaultValues?: FormSchema,
    marked: string | null,
    handleQuery: (story: string) => Promise<void>,
    handleClick: (submit: () => Promise<void>) => void,
}
    & PropsControlButton

function QueryStoryView({
    defaultValues = formDefaults,
    marked,
    feedback,
    phase,
    handleQuery,
    handleClick
}: Props) {

    const form = useForm({
        defaultValues,
        validators: {
            onChange: storySchema,
            onMount: storySchema,
        },
        onSubmit: async ({ value }) => { await handleQuery(value.story) }
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            onChange={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <form.Field
                name="story"
                children={(field) => (
                    <StoryField
                        field={field}
                        marked={marked}
                    />
                )}
            />
            <ControlButton
                feedback={feedback}
                phase={phase}
                onClick={() => { handleClick(form.handleSubmit) }}
            />
        </form >
    )
}

export default QueryStoryView
