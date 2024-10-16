import { styled } from 'solid-styled-components';

/**
 * Specific-width icon container
 */
export const InlineIcon = styled.div<{ size: 'short' | 'normal' | 'wide' }>`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: ${({ size }) =>
    size === 'wide' ? 62 : size === 'normal' ? 42 : 14}px;
`;
