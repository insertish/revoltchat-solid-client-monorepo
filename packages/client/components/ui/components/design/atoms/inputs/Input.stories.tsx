import type { ComponentStory } from '../../../stories';
import { Input } from './Input';

export default {
  category: 'Design System/Atoms/Inputs',
  component: Input,
  stories: [
    {
      title: 'Primary',
      props: {
        palette: 'primary',
      },
    },
    {
      title: 'Secondary',
      props: {
        palette: 'secondary',
      },
    },
    {
      title: 'Primary (Disabled)',
      props: {
        palette: 'primary',
        disabled: true,
      },
    },
    {
      title: 'Secondary (Disabled)',
      props: {
        palette: 'secondary',
        disabled: true,
      },
    },
    {
      title: 'Primary (Placeholder)',
      props: {
        palette: 'secondary',
        value: '',
        placeholder: 'Placeholder text',
      },
    },
    {
      title: 'Secondary (Placeholder)',
      props: {
        palette: 'secondary',
        value: '',
        placeholder: 'Placeholder text',
      },
    },
  ],
  props: {
    value: 'I am an input...',
  },
  propTypes: {
    palette: ['primary', 'secondary'],
    value: 'string',
    placeholder: 'string',
  },
} as ComponentStory<typeof Input>;
