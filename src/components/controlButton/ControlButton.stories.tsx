import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ControllButton from './ControllButton';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'ControllButton',
    component: ControllButton,
    tags: ['autodocs'],
    args: {
        setPhase: fn(),
        feedback: "Feedback",
        abortUpload: fn()
    },
} satisfies Meta<typeof ControllButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Idle: Story = {
    args: {
        phase: "idle"
    }
};
export const Ready: Story = {
    args: {
        phase: "ready"
    }
};
export const Uploading: Story = {
    args: {
        phase: "uploading"
    }
};
export const Confirm: Story = {
    args: {
        phase: "confirm"
    }
};
export const Error: Story = {
    args: {
        phase: "error"
    }
};
