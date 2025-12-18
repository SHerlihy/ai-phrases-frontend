import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import { expect, it } from 'vitest'

const FEEDBACK_ERROR = "BAD!"
const FEEDBACK_SUCCESS = "GOOD!"

const Sanity = (props: { err: string, res: string }) => {
    const { isError } = useQuery({
        queryKey: ["sanity"],
        queryFn: () => { return Promise.reject(new Error("FAILURE")) },
        retry: false
    })
    return (
        <p>
            {isError && props.err}
            {!isError && props.res}
        </p>
    )
}

it("show err message", async () => {
    const queryClient = new QueryClient()
    // act(() => {
        render(
            <QueryClientProvider client={queryClient}>
                <Sanity
                    err={FEEDBACK_ERROR}
                    res={FEEDBACK_SUCCESS}
                />
            </QueryClientProvider>
        )
    // })

    let feedback: HTMLElement | null;
    const findRegexp = new RegExp(FEEDBACK_ERROR)
    await waitFor(() => {
        feedback = screen.queryByText(findRegexp)
        expect(feedback).not.toBeNull()
    })
})
