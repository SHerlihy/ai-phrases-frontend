import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import UploadFileView from './UploadFileView';
import { FEEDBACK_PENDING } from './UploadFileModel';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'UploadFileView',
    component: UploadFileView,
    tags: ['autodocs'],
    args: {
        title: "Upload",
        handleChangeUpload: fn()
    },
} satisfies Meta<typeof UploadFileView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const InitPending: Story = {
    args: {
        feedback: FEEDBACK_PENDING,
        isPending: true,
        isInit: true,
    }
};

export const InitSettled: Story = {
    args: {
        feedback: "Init Success",
        isPending: false,
        isInit: true,
    }
};

export const UploadPending: Story = {
    args: {
        feedback: FEEDBACK_PENDING,
        isPending: true,
        isInit: false,
    }
};

export const UploadSettled: Story = {
    args: {
        feedback: "Upload Success",
        isPending: false,
        isInit: false,
    }
};
