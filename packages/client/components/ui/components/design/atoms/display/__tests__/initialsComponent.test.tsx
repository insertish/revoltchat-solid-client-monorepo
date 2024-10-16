import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';

import { Initials, toInitials } from '../Initials';

const TEST_DATA = [
  {
    input: 'test string',
    output: 'ts',
  },
  {
    input: 'test string',
    maxLength: 1,
    output: 't',
  },
  {
    input: 'some other test string which is quite long',
    maxLength: 3,
    output: 'sot',
  },
];

describe('Initials component', () => {
  it('should have correct output', () => {
    for (const entry of TEST_DATA) {
      expect(toInitials(entry.input, entry.maxLength)).toStrictEqual(
        entry.output.split('')
      );
    }
  });

  it('should render the correct output', () => {
    for (const entry of TEST_DATA) {
      render(() => <Initials {...entry} />);
      const textElm = screen.getByText(entry.output);
      expect(textElm).toBeInTheDocument();
    }
  });
});
