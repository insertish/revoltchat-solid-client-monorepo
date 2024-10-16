import TextColourDecorator from '../../../decorators/TextColourDecorator';
import type { ComponentStory } from '../../stories';
import { OverflowingText } from './OverflowingText';

export default {
  category: 'Design System/Layout',
  component: OverflowingText,
  stories: [
    {
      title: 'Default',
    },
  ],
  props: {
    children: 'This is a long piece of text.',
  },
  propTypes: {
    children: 'string',
  },
  decorators: [
    (props) => (
      <div
        style={{
          display: 'flex',
          'justify-content': 'stretch',
          width: '120px',
        }}
      >
        {props.children}
      </div>
    ),
    TextColourDecorator,
  ],
} as ComponentStory<typeof OverflowingText>;
