import type { ComponentProps } from 'solid-js';

import type { ComponentStory } from '../../../stories';
import { Preloader } from './Preloader';

export default {
  category: 'Design System/Atoms/Indicators',
  component: Preloader,
  stories: [
    {
      title: 'Ring',
      props: {
        type: 'ring',
      },
    },
    {
      title: 'Spinner',
      props: {
        type: 'spinner',
      },
    },
  ],
  propTypes: {
    type: ['ring', 'spinner'],
    grow: 'boolean',
  },
} as ComponentStory<typeof Preloader, ComponentProps<typeof Preloader>>;
