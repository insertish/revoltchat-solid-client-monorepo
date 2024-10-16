import type { ComponentProps } from 'solid-js';

import TestImage from '../../../test-images/the-halal-design-studio-ZrJpH6W-HDs-unsplash.jpg';
import type { ComponentStory } from '../../stories';
import { MessageContainer } from './Container';

export default {
  category: 'Messaging/Message/Container',
  component: MessageContainer,
  stories: [
    { title: 'Default' },
    {
      title: 'Tail',
      props: {
        tail: true,
      },
    },
    {
      title: 'Edited Message',
      props: {
        children: 'hello this is an edit',
        edited: +new Date('Thu, 30 Dec 2022 12:33:35 GMT'),
      },
    },
    {
      title: 'Edited Tail',
      props: {
        tail: true,
        children: 'hello this is an edit',
        edited: +new Date('Thu, 30 Dec 2022 12:33:35 GMT'),
      },
    },
    {
      title: 'Coloured Username',
      props: {
        colour: 'linear-gradient(30deg, purple, orange)',
      },
    },
  ],
  props: {
    children: 'I love rolt!!!!!',
    timestamp: +new Date('Thu, 29 Dec 2022 12:33:35 GMT'),
    avatar: TestImage,
    username: 'rolt user',
    _referenceTime: +new Date('Thu, 29 Dec 2022 13:00:00 GMT'),
  },
  propTypes: {
    children: 'string',
    avatar: 'string',
    colour: 'string',
    username: 'string',
    timestamp: 'number',
    edited: 'number',
    header: 'component',
    tail: 'boolean',
  },
} as ComponentStory<
  typeof MessageContainer,
  ComponentProps<typeof MessageContainer>
>;
