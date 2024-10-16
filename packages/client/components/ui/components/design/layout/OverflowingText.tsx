import { styled } from 'solid-styled-components';

/**
 * Container to prevent text overflow
 */
export const OverflowingText = styled('div')`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  * {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
