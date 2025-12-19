import UploadFileView from '@/features/uploadFile/UploadFileView';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'UploadFileView',
    component: UploadFileView,
    tags: ['autodocs'],
    args: {
        title: "Upload",
        handleClickValue: fn(),
        handleClickUpload: fn()
    },
} satisfies Meta<typeof UploadFileView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Value: Story = {
    args: {
        value: "datetime",
        isWorking: false,
        hasChanged: false
    }
};

export const Working: Story = {
    args: {
        value: "datetime",
        isWorking: true,
        hasChanged: false
    }
};

export const Changed: Story = {
    args: {
        value: "datetime",
        isWorking: false,
        hasChanged: true
    }
};
