import { styled } from 'solid-styled-components';

/**
 * Container to break all text and prevent overflow from math blocks
 *
 * Use this to wrap Markdown
 */
export const BreakText = styled('div')`
  word-break: break-word;

  .math {
    overflow-x: auto;
    overflow-y: hidden;
    max-height: 100vh;
  }
`;
