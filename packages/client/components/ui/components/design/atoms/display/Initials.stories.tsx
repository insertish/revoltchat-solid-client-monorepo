import type { ComponentProps } from 'solid-js';

import TextColourDecorator from '../../../../decorators/TextColourDecorator';
import type { ComponentStory } from '../../../stories';
import { Initials } from './Initials';

export default {
  category: 'Design System/Atoms/Display',
  component: Initials,
  stories: [
    {
      title: 'Default',
      props: {
        input: 'this is a long string',
        maxLength: 3,
      },
    },
  ],
  propTypes: {
    input: 'string',
    maxLength: 'number',
  },
  decorators: [TextColourDecorator],
} as ComponentStory<typeof Initials, ComponentProps<typeof Initials>>;
