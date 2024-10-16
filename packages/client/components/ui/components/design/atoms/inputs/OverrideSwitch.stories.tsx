import type { ComponentStory } from '../../../stories';
import { OverrideSwitch } from './OverrideSwitch';

export default {
  category: 'Design System/Atoms/Inputs',
  component: OverrideSwitch,
  stories: [
    {
      title: 'Default',
    },
    {
      title: 'Disabled',
      props: {
        disabled: true,
      },
    },
  ],
  propTypes: {
    disabled: 'boolean',
    state: ['Allow', 'Neutral', 'Deny'],
    onChange: 'function',
  },
  props: {
    state: 'Neutral',
  },
  effects: {
    onChange: (_, state) => ({
      state,
    }),
  },
} as ComponentStory<typeof OverrideSwitch>;
