import type { Meta, StoryObj } from '@storybook/html';
import type { ComponentProps } from 'solid-js';

import { Button } from './Button';

type Story = StoryObj<ComponentProps<typeof Button>>;

export default {
  title: 'Design System/Atoms/Inputs/Button',
  tags: ['autodocs'],
  render: (props: any) => <Button {...props} />,
  argTypes: {
    size: {
      options: ['normal', 'icon', 'fluid'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['primary', 'secondary', 'plain', 'success', 'warning', 'error'],
      control: { type: 'radio' },
    },
  },
} as Meta<ComponentProps<typeof Button>>;

export const Primary: Story = {
  args: {
    children: "Hello, I'm a button!",
    size: 'normal',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Style',
    size: 'normal',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'Awesome!',
    size: 'normal',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'This looks wrong...',
    size: 'normal',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Stop! Look at me first!',
    size: 'normal',
    variant: 'error',
  },
};

export const Plain: Story = {
  args: {
    children: 'Just some plain old text...',
    size: 'fluid',
    variant: 'plain',
  },
};

export const Icon: Story = {
  args: {
    children: '🦄',
    size: 'icon',
    variant: 'secondary',
  },
};
