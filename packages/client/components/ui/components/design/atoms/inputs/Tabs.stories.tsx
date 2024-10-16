import type { ComponentProps } from 'solid-js';
import { createSignal } from 'solid-js';

import type { ComponentStory } from '../../../stories';
import { Tabs } from './Tabs';

const [tab, onSelect] = createSignal('a');

export default {
  category: 'Design System/Atoms/Inputs',
  component: Tabs,
  stories: [
    {
      title: 'Default',
      props: {
        tabs: () => ({
          a: {
            label: 'First',
          },
          b: {
            label: 'Second',
          },
          c: {
            label: 'Last',
          },
        }),
        tab,
        onSelect,
      },
    },
  ],
} as ComponentStory<typeof Tabs, ComponentProps<typeof Tabs>>;
