im, { HandleSubmit }port type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import QueryStoryView from './QueryStoryView';
import { seventyK } from './components/StoryBox';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'QueryStoryView',
    component: QueryStoryView,
    tags: ['autodocs'],
    args: {
        handleSubmit: fn(),
        handleFormActionReset: fn()
    },
} satisfies Meta<typeof QueryStoryView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Empty: Story = {
    args: {
        defaultValues: { story: "" },
        isResponseError: false,
        marked: null
    }
};

export const WholeStory: Story = {
    args: {
        defaultValues: { story: seventyK },
        isResponseError: false,
        marked: null
    }
};

export const Error: Story = {
    args: {
        defaultValues: { story: seventyK },
        isResponseError: true,
        marked: null
    }
};

export const Marked: Story = {
    args: {
        defaultValues: { story: seventyK },
        isResponseError: false,
        marked: "Marked story"
    }
};
