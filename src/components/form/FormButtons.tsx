import { Button } from "@/components/ui/button"

export const SUBMIT = 'submit'
export const PENDING = '...'
export const RESET = 'reset'

function FormButtons({
    canSubmit,
    isSubmitting,
    handleReset
}: {
    canSubmit: boolean,
    isSubmitting: boolean,
    handleReset: () => void
}) {
    return (
        <>
            <Button
                type="submit"
                disabled={!canSubmit}
            >
                {isSubmitting ? PENDING : SUBMIT}
            </Button>
            <Button type="reset" onClick={handleReset}>
                {RESET}
            </Button>
        </>
    )
}

export default FormButtons
