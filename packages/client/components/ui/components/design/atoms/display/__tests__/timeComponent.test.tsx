import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';

import { formatTime, Time } from '../Time';
import { TIME_TEST_DATA } from '../Time.stories';
import dayjs from "dayjs";

describe('Time component', () => {
  it('should have correct output', () => {
    for (const entry of TIME_TEST_DATA) {
      console.log(dayjs(entry.value).format())
      expect(formatTime(entry)).toBe(entry.expected);
    }
  });

  it('should render the correct output', () => {
    for (const entry of TIME_TEST_DATA) {
      render(() => <Time {...entry} />);
      const textElm = screen.getByText(entry.expected);
      expect(textElm).toBeInTheDocument();
    }
  });
});
