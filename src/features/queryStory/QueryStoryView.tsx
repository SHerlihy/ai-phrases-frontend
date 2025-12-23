import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import StoryField from './components/StoryField'
import FormButtons from '@/components/form/FormButtons'

const storySchema = z.object({
    story: z.string()
})

type FormDefaults = z.infer<typeof storySchema>
export const formDefaults: FormDefaults = {
    story: ""
}

type Props = {
    defaultValues?: FormDefaults,
    handleSubmit: (e: string) => Promise<void>,
    handleFormActionReset: () => void,
    isResponseError: boolean,
    marked: string|null,
}

function QueryStoryView({
    defaultValues = formDefaults,
    handleSubmit,
    handleFormActionReset,
    isResponseError,
    marked
}: Props) {

    const form = useForm({
        defaultValues,
        validators: {
            onChange: storySchema,
            onMount: storySchema,
        },
        onSubmit: async ({ value }) => { await handleSubmit(value.story) }
    })

    const handleFormReset = () => {
        form.reset()
        handleFormActionReset()
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            onChange={(e) => {
                e.preventDefault()
                e.stopPropagation()

                if (isResponseError) {
                    handleFormActionReset()
                }
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
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) =>
                    <FormButtons
                        canSubmit={canSubmit}
                        isSubmitting={isSubmitting}
                        handleReset={handleFormReset}
                    />}
            />
        </form >
    )
}

export default QueryStoryView
