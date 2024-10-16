import type { ComponentProps } from 'solid-js';

import type { ComponentStory } from '../../../stories';
import { SaveStatus } from './SaveStatus';

export default {
  category: 'Design System/Atoms/Indicators',
  component: SaveStatus,
  stories: [
    {
      title: 'Saved',
      props: {
        status: 'saved',
      },
    },
    {
      title: 'Editing',
      props: {
        status: 'editing',
      },
    },
    {
      title: 'Saving',
      props: {
        status: 'saving',
      },
    },
  ],
  propTypes: {
    status: ['saved', 'saving', 'editing'],
  },
} as ComponentStory<typeof SaveStatus, ComponentProps<typeof SaveStatus>>;
