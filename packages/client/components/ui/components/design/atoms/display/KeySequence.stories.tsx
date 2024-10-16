import type { ComponentProps } from 'solid-js';

import TextColourDecorator from '../../../../decorators/TextColourDecorator';
import type { ComponentStory } from '../../../stories';
import { KeySequence } from './KeySequence';

export default {
  category: 'Design System/Atoms/Display',
  component: KeySequence,
  stories: [
    {
      title: 'Default',
      props: {
        sequence: 'Control+Alt+ArrowUp',
        short: true,
      },
    },
    {
      title: 'Simple',
      props: {
        sequence: 'Control+Alt+ArrowUp',
        simple: true,
        short: true,
      },
    },
    {
      title: 'Long',
      props: {
        sequence: 'Control+Alt+ArrowUp',
        short: false,
      },
    },
  ],
  propTypes: {
    sequence: 'string',
    short: 'boolean',
    simple: 'boolean',
  },
} as ComponentStory<typeof KeySequence, ComponentProps<typeof KeySequence>>;
