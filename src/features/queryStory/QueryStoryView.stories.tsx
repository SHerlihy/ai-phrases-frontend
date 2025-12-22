import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import QueryStoryView from './QueryStoryView';
import { seventyK } from '@/stories/StoryBox';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'QueryStoryView',
    component: QueryStoryView,
    tags: ['autodocs'],
    args: {
        postMarkStory: fn(),
        handleFormActionReset: fn()
    },
} satisfies Meta<typeof QueryStoryView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Empty: Story = {
    args: {
        defaultValues: { story: "" },
        isResponseError: false
    }
};

export const WholeStory: Story = {
    args: {
        defaultValues: { story: seventyK },
        isResponseError: false
    }
};

export const Error: Story = {
    args: {
        defaultValues: { story: seventyK },
        isResponseError: true
    }
};
