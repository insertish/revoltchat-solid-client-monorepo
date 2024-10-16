import type { ComponentStory } from '../../../stories';
import { ComboBox } from './ComboBox';

export default {
  category: 'Design System/Atoms/Inputs',
  component: ComboBox,
  stories: [
    {
      title: 'Default',
    },
  ],
  props: {
    children: () => (
      <>
        <option>Option A</option>
        <option>Option B</option>
        <option>Option C</option>
      </>
    ),
  },
} as ComponentStory<typeof ComboBox>;
