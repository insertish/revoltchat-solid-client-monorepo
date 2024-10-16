import { BiSolidUser } from 'solid-icons/bi';

import type { ComponentStory } from '../../../stories';
import { MenuButton } from './MenuButton';

export default {
  category: 'Design System/Atoms/Inputs',
  component: MenuButton,
  stories: [
    {
      title: 'Thin (default, active)',
      props: {
        attention: 'active',
      },
    },
    {
      title: 'Normal',
      props: {
        size: 'normal',
      },
    },
    {
      title: 'Normal (selected)',
      props: {
        size: 'normal',
        attention: 'selected',
      },
    },
    {
      title: 'Normal (active)',
      props: {
        size: 'normal',
        attention: 'active',
      },
    },
    {
      title: 'Normal (muted)',
      props: {
        size: 'normal',
        attention: 'muted',
      },
    },
    {
      title: 'Normal (active, alert)',
      props: {
        size: 'normal',
        attention: 'active',
        alert: true,
      },
    },
    {
      title: 'Normal (active, alert=1)',
      props: {
        size: 'normal',
        attention: 'active',
        alert: 1,
      },
    },
    {
      title: 'Normal (active, icon)',
      props: {
        size: 'normal',
        attention: 'active',
        icon: <BiSolidUser size={16} />,
        children: 'User Settings',
      },
    },
  ],
  props: {
    children: 'Menu Item',
  },
  propTypes: {
    children: 'string',
  },
} as ComponentStory<typeof MenuButton>;
