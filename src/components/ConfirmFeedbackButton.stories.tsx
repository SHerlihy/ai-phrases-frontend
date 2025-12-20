import type { Meta, StoryObj } from '@storybook/react';
import ConfirmFeedbackButton from './ConfirmFeedbackButton';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'ConfirmFeedbackButton',
    component: ConfirmFeedbackButton,
    tags: ['autodocs'],
    args: {feedback: "feedback message"},
} satisfies Meta<typeof ConfirmFeedbackButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Ready: Story = {
    args: {
        isPending: false,
    }
};

export const Working: Story = {
    args: {
        isPending: true,
    }
};
