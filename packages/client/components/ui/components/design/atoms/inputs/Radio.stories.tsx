import type { ComponentStory } from '../../../stories';
import { Radio } from './Radio';

export default {
  category: 'Design System/Atoms/Inputs',
  component: Radio,
  stories: [
    {
      title: 'Default',
      props: {
        value: false,
      },
    },
    {
      title: 'Checked',
      props: {
        value: true,
      },
    },
    {
      title: 'Disabled',
      props: {
        disabled: true,
      },
    },
  ],
  props: {
    title: 'Hello, I am a radio button',
    description: 'And this is a cool description.',
  },
  propTypes: {
    title: 'string',
    description: 'string',
    disabled: 'boolean',
    value: 'boolean',
    onSelect: 'function',
  },
  effects: {
    onSelect: (props) => ({
      value: !props.value,
    }),
  },
} as ComponentStory<typeof Radio>;
