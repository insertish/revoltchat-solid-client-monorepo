import { styled } from 'solid-styled-components';

/**
 * Group a set of category buttons (M3+Fluent)
 */
export const CategoryButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme!.gap.xs};

  border-radius: ${(props) => props.theme!.borderRadius.xl};
  overflow: hidden;
`;
