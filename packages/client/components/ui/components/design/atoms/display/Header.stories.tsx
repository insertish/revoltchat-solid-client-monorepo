import type { ComponentProps } from 'solid-js';

import TextColourDecorator from '../../../../decorators/TextColourDecorator';
import type { ComponentStory } from '../../../stories';
import { Column } from '../../layout';
import { Header, HeaderWithTransparency } from './Header';

export default {
  category: 'Design System/Atoms/Display',
  component: Header,
  stories: [
    {
      title: 'Default',
    },
    {
      title: 'With Transparency',
      component: HeaderWithTransparency,
      decorators: [
        (props) => (
          <Column>
            <Column>
              {new Array(5).fill(0).map(() => (
                <span>background content</span>
              ))}
            </Column>
            {props.children}
          </Column>
        ),
      ],
    },
  ],
  props: {
    children: 'My Cool Server',
  },
  decorators: [TextColourDecorator],
  propTypes: {
    children: 'string',
  },
} as ComponentStory<typeof Header, ComponentProps<typeof Header>>;
