import type { ComponentStory } from '../../../stories';
import { ColourSwatches } from './ColourSwatches';

export default {
  category: 'Design System/Atoms/Inputs',
  component: ColourSwatches,
  stories: [
    {
      title: 'Default',
      props: {
        value: '#FD6671',
      },
    },
    {
      title: 'Default (Different Palette)',
      props: {
        value: '#cc6',
        presets: [
          ['#cc6', '#000', '#f55', '#a88'],
          ['#bc2', '#aa5', '#fb8', '#16d'],
        ],
      },
    },
  ],
  propTypes: {
    value: 'string',
    onChange: 'function',
  },
} as ComponentStory<typeof ColourSwatches>;
