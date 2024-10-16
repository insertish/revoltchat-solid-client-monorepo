import type { ComponentProps } from 'solid-js';

import TextColourDecorator from '../../../../decorators/TextColourDecorator';
import type { ComponentStory } from '../../../stories';
import { Key } from './Key';

export default {
  category: 'Design System/Atoms/Display',
  component: Key,
  stories: [
    {
      title: 'Default',
      props: {
        children: 'K',
      },
    },
    {
      title: 'Simple',
      props: {
        children: 'ArrowUp',
        simple: true,
      },
    },
    {
      title: 'Special Key Replacement',
      props: {
        children: 'ArrowUp',
      },
    },
  ],
  propTypes: {
    children: 'string',
    short: 'boolean',
    simple: 'boolean',
  },
} as ComponentStory<typeof Key, ComponentProps<typeof Key>>;
