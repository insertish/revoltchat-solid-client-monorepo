import type { ComponentProps } from 'solid-js';

import TextColourDecorator from '../../../../decorators/TextColourDecorator';
import type { ComponentStory } from '../../../stories';
import { Time } from './Time';

const REFERENCE_TIME = '2022-12-07T20:27:50.000';

export const TIME_TEST_DATA = [
  {
    value: '2022-12-07T20:20:50.000',
    format: 'calendar' as const,
    expected: 'Today at 8:20 PM',
    referenceTime: REFERENCE_TIME,
  },
  {
    value: '2022-12-05T20:20:50.000',
    format: 'calendar' as const,
    expected: 'Last Monday at 8:20 PM',
    referenceTime: REFERENCE_TIME,
  },
  {
    value: '2022-12-01T20:20:50.000',
    format: 'time' as const,
    expected: '20:20',
    referenceTime: REFERENCE_TIME,
  },
];

export default {
  category: 'Design System/Atoms/Display',
  component: Time,
  stories: [
    {
      title: 'Calendar',
      props: { ...TIME_TEST_DATA[0] },
    },
    {
      title: 'Time',
      props: { ...TIME_TEST_DATA[2] },
    },
  ],
  propTypes: {
    value: 'string',
    format: ['time', 'calendar'],
    referenceTime: 'string',
  },
  decorators: [TextColourDecorator],
} as ComponentStory<typeof Time, ComponentProps<typeof Time>>;
