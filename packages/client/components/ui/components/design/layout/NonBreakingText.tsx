import { styled } from 'solid-styled-components';

/**
 * Container to prevent text breaking
 */
export const NonBreakingText = styled('div')`
  white-space: nowrap;

  * {
    white-space: nowrap;
  }
`;
