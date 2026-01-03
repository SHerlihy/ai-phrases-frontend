import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import QueryStoryView from './QueryStoryView';
import { seventyK } from './components/StoryBox';
import { FEEDBACK_READY } from './QueryStoryModel';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'QueryStoryView',
    component: QueryStoryView,
    tags: ['autodocs'],
    args: {
        handleClick: fn(),
        handleQuery: fn()
    },
} satisfies Meta<typeof QueryStoryView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Empty: Story = {
    args: {
        defaultValues: { story: "" },
        marked: null,
        phase: "ready",
        feedback: FEEDBACK_READY
    }
};

export const WholeStory: Story = {
    args: {
        defaultValues: { story: seventyK },
        marked: null,
        phase: "ready",
        feedback: FEEDBACK_READY
    }
};

export const Error: Story = {
    args: {
        defaultValues: { story: seventyK },
        marked: null,
        phase: "ready",
        feedback: FEEDBACK_READY
    }
};

export const Marked: Story = {
    args: {
        defaultValues: { story: seventyK },
        marked: "Marked story",
        phase: "ready",
        feedback: FEEDBACK_READY
    }
};
