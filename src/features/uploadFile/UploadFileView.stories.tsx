import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import UploadFileView from './UploadFileView';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'UploadFileView',
    component: UploadFileView,
    tags: ['autodocs'],
    args: {
        title: "Upload",
        handleChange: fn()
    },
} satisfies Meta<typeof UploadFileView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const InitPending: Story = {
    args: {
        feedback: "",
        phase: "pending"
    }
};

export const InitSettled: Story = {
    args: {
        feedback: "Init Success",
        phase: "confirm"
    }
};
