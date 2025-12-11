import StoryBox from '@/components/StoryBox';
import type { Meta, StoryObj } from '@storybook/react';
import { paragraph, seventyK } from './StoryBox';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'StoryBox',
  component: StoryBox,
  tags: ['autodocs'],
} satisfies Meta<typeof StoryBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Empty: Story = {
    args: {
        story: ""
    }
};

export const Paragraph: Story = {
    args: {
        story: paragraph
    }
};

export const SeventyK: Story = {
    args: {
        story: seventyK
    }
};
