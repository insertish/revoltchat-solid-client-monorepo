import type { ComponentProps } from 'solid-js';

import makeSvgDecorator from '../../../../decorators/SvgDecorator';
import type { ComponentStory } from '../../../stories';
import { UserStatusGraphic } from './UserStatus';

export default {
  category: 'Design System/Atoms/Indicators',
  component: UserStatusGraphic,
  stories: [
    {
      title: 'Online',
    },
    {
      title: 'Idle',
      props: {
        status: 'Idle',
      },
    },
    {
      title: 'Busy',
      props: {
        status: 'Busy',
      },
    },
    {
      title: 'Focus',
      props: {
        status: 'Focus',
      },
    },
    {
      title: 'Invisible',
      props: {
        status: 'Invisible',
      },
    },
  ],
  props: {
    status: 'Online',
  },
  decorators: [makeSvgDecorator(32, 128)],
  propTypes: {
    status: 'string',
  },
} as ComponentStory<
  typeof UserStatusGraphic,
  ComponentProps<typeof UserStatusGraphic>
>;
