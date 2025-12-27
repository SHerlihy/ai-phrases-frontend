import { describe, expect, it } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { catchError, withResolvers } from '@/lib/async';
import { formDefaults } from './QueryStoryView';
import QueryStoryModel from './QueryStoryModel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('QueryStory', () => {

    const returnStory = "return story"

    const queryClient = new QueryClient()
    it('renders the component', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QueryStoryModel
                    postMarkStory={(s) => Promise.resolve(returnStory)}
                    abortMarkStory={() => { }}
                />
            </QueryClientProvider>
        )
        screen.debug();
    })

    it('tab to key elements', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QueryStoryModel
                    postMarkStory={(s) => Promise.resolve(returnStory)}
                    abortMarkStory={() => { }}
                />
            </QueryClientProvider>
        )
        const user = userEvent.setup()

        const storyInput = await screen.findByRole("textbox")
        const controlButton = await screen.findByRole("button")

        while (storyInput !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(storyInput)


        while (controlButton !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(controlButton)
    })

    it('shows story returned from post', async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <QueryStoryModel
                    postMarkStory={(s) => Promise.resolve(returnStory)}
                    abortMarkStory={() => { }}
                />
            </QueryClientProvider>
        )

        const user = userEvent.setup()

        const storyInput = await screen.findByRole("textbox")
        const controlButton = await screen.findByRole("button")

        expect(storyInput.textContent).not.toEqual(returnStory)

        act(() => {
            user.click(controlButton)
        })

        await waitFor(() => {
            expect(storyInput.textContent).toEqual(returnStory)
        })
    })
})
