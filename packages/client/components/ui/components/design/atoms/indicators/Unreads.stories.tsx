import type { ComponentProps } from 'solid-js';

import makeSvgDecorator from '../../../../decorators/SvgDecorator';
import type { ComponentStory } from '../../../stories';
import { UnreadsGraphic } from './Unreads';

export default {
  category: 'Design System/Atoms/Indicators',
  component: UnreadsGraphic,
  stories: [
    {
      title: 'Default',
    },
    {
      title: 'With Count',
      props: {
        count: 3,
      },
    },
    {
      title: 'Overflow Count',
      props: {
        count: 10,
      },
    },
  ],
  props: {
    unread: true,
  },
  decorators: [makeSvgDecorator(32, 128)],
  propTypes: {
    unread: 'boolean',
    count: 'number',
  },
} as ComponentStory<
  typeof UnreadsGraphic,
  ComponentProps<typeof UnreadsGraphic>
>;
