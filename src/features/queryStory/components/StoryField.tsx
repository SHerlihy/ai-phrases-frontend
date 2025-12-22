import Field from '@/components/form/Field'
import { Textarea } from '@/components/ui/textarea'
import { useEffect } from 'react'

function StoryField({
    field,
    marked,
}: {
    field: any,
    marked: string | null,
}) {

    useEffect(() => {
        if (marked) {
            field.setValue(marked)
        }
    }, [marked])

    return (
        <Field
            errors={field.state.meta.errorMap.onChange}
        >
            <Textarea
                ref={(textarea) => {
                    if (textarea) {
                        textarea.style.height = "0px";
                        textarea.style.height = textarea.scrollHeight + "px";
                    }
                }}
                placeholder="Paste your story here :)"
                className={"h-full overflow-hidden"}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
            />
        </Field>
    )
}

export default StoryField
