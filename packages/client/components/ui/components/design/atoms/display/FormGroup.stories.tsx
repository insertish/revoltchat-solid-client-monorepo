import type { ComponentProps } from 'solid-js';

import type { ComponentStory } from '../../../stories';
import { Input } from '../inputs';
import { FormGroup } from './FormGroup';
import { Typography } from './Typography';

export default {
  category: 'Design System/Atoms/Form Group',
  component: FormGroup,
  stories: [{ title: 'Default' }],
  props: {
    children: () => (
      <>
        <Typography variant='label'>Title</Typography>
        <Input placeholder='Type something...' />
      </>
    ),
  },
  propTypes: {
    children: 'component',
  },
} as ComponentStory<typeof FormGroup, ComponentProps<typeof FormGroup>>;
