import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import UploadInput from './UploadInput';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'UploadInput',
  component: UploadInput,
  tags: ['autodocs'],
  args: { handleChange: fn() },
} satisfies Meta<typeof UploadInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Uploading: Story = {
    args: {
        disabled: true,
    }
};

export const Ready: Story = {
    args: {
        disabled: false,
    }
};
