import type { ComponentProps } from 'solid-js';

import TestImage from '../../../../test-images/the-halal-design-studio-ZrJpH6W-HDs-unsplash.jpg';
import type { ComponentStory } from '../../../stories';
import { UserStatusGraphic } from '../indicators';
import { Avatar } from './Avatar';

export default {
  category: 'Design System/Atoms/Avatar',
  component: Avatar,
  stories: [
    { title: 'Default' },
    {
      title: 'Cut Out',
      props: {
        interactive: true,
        holepunch: 'bottom-right',
        overlay: () => <UserStatusGraphic status='Online' />,
      },
    },
    {
      title: 'Fallback',
      props: {
        fallback: 'test fallback string',
        src: undefined,
        interactive: true,
        holepunch: 'bottom-right',
        overlay: () => <UserStatusGraphic status='Focus' />,
      },
    },
  ],
  props: {
    size: 256,
    src: TestImage,
  },
  propTypes: {
    size: 'number',
    src: 'string',
    fallback: 'string',
    interactive: 'boolean',
    holepunch: ['none', 'bottom-right', 'top-right', 'right'],
    overlay: 'component',
  },
} as ComponentStory<typeof Avatar, ComponentProps<typeof Avatar>>;
