import { describe, expect, it } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { catchError, withResolvers } from '@/lib/async';
import { formDefaults } from './QueryStoryView';
import { RESET, SUBMIT } from '@/components/form/FormButtons';
import QueryStoryModel from './QueryStoryModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('QueryStory', () => {

    const returnStory = "return story"

    const queryClient = new QueryClient()
    it('renders the component', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QueryStoryModel
                    postMarkStory={(s) => Promise.resolve([undefined, returnStory])}
                    abortMarkStory={()=>{}}
                />
            </QueryClientProvider>
        )
        screen.debug();
    })

    it('tab to key elements', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QueryStoryModel
                    postMarkStory={(s) => Promise.resolve([undefined, returnStory])}
                    abortMarkStory={()=>{}}
                />
            </QueryClientProvider>
        )
        const user = userEvent.setup()

        const storyInput = await screen.findByRole("textbox")
        const submitBtn = await screen.findByText(SUBMIT)
        const resetBtn = await screen.findByText(RESET)

        while (storyInput !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(storyInput)


        while (submitBtn !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(submitBtn)


        while (resetBtn !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(resetBtn)
    })

    it('shows story returned from post', async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <QueryStoryModel
                    postMarkStory={(s) => Promise.resolve([undefined, returnStory])}
                    abortMarkStory={()=>{}}
                />
            </QueryClientProvider>
        )

        const user = userEvent.setup()

        const storyInput = await screen.findByRole("textbox")
        const submitBtn = await screen.findByText(SUBMIT)

        expect(storyInput.textContent).not.toEqual(returnStory)

        act(() => {
            user.click(submitBtn)
        })

        await waitFor(() => {
            expect(storyInput.textContent).toEqual(returnStory)
        })
    })

    it('disables submit button on post pending', async () => {
        const { promise, resolve, reject } = withResolvers()

        const postMarkStory = async (s) => {
            return await catchError(promise)
        }

        render(
            <QueryClientProvider client={queryClient}>
                <QueryStoryModel
                    postMarkStory={postMarkStory}
                    abortMarkStory={()=>{}}
                />
            </QueryClientProvider>
        )

        const user = userEvent.setup()

        const storyInput = await screen.findByRole("textbox")
        const submitBtn = await screen.findByText(SUBMIT) as HTMLButtonElement

        expect(storyInput.textContent).toEqual(formDefaults.story)

        act(() => {
            user.click(submitBtn)
        })

        await waitFor(() => {
            expect(storyInput.textContent).toEqual(formDefaults.story)
            expect(submitBtn.disabled === true)
        })
    })

    it('enables submit button on post success', async () => {
        const postSuccess = "Post Success"

        const { promise, resolve, reject } = withResolvers()

        const postMarkStory = async (s) => {
            return await catchError(promise)
        }

        render(
            <QueryClientProvider client={queryClient}>
                <QueryStoryModel
                    postMarkStory={postMarkStory}
                    abortMarkStory={()=>{}}
                />
            </QueryClientProvider>
        )

        const user = userEvent.setup()

        const storyInput = await screen.findByRole("textbox")
        const submitBtn = await screen.findByText(SUBMIT) as HTMLButtonElement

        expect(storyInput.textContent).toEqual(formDefaults.story)

        act(() => {
            user.click(submitBtn)
        })

        act(() => {
            resolve(postSuccess)
        })

        await waitFor(() => {
            expect(storyInput.textContent).toEqual(postSuccess)
            expect(submitBtn.disabled === false)
        })
    })
})
