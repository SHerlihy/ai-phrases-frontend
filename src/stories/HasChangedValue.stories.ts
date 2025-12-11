import HasChangedValue from '@/components/HasChangedValue';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'HasChangedValue',
    component: HasChangedValue,
    tags: ['autodocs'],
    args: {
        value: "datetime",
        handleClick: fn()
    },
} satisfies Meta<typeof HasChangedValue>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Value: Story = {
    args: {
        isWorking: false,
        hasChanged: false
    }
};

export const Working: Story = {
    args: {
        isWorking: true,
        hasChanged: false
    }
};

export const Changed: Story = {
    args: {
        isWorking: false,
        hasChanged: true
    }
};
