import makeContainerDecorator from '../../../../decorators/ContainerDecorator';
import type { ComponentStory } from '../../../stories';
import { MessageDivider } from './MessageDivider';

export default {
  category: 'Design System/Atoms/Indicators',
  component: MessageDivider,
  stories: [
    {
      title: 'Default',
    },
    {
      title: 'Unread',
      props: {
        unread: true,
      },
    },
  ],
  props: {
    date: '1st December 2022',
  },
  decorators: [
    makeContainerDecorator({
      width: 360,
      flex: 'col',
    }),
    makeContainerDecorator({
      height: 32,
    }),
  ],
  propTypes: {
    date: 'string',
    unread: 'boolean',
  },
} as ComponentStory<typeof MessageDivider>;
