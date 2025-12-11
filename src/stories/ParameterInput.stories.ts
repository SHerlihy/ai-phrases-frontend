import ParameterInput from '@/components/ParameterInput';
import type { Meta, StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ParameterInput',
  component: ParameterInput,
  tags: ['autodocs'],
} satisfies Meta<typeof ParameterInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
