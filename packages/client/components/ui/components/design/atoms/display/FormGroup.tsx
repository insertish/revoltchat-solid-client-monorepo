import { styled } from 'solid-styled-components';

/**
 * Input element and label grouping
 */
export const FormGroup = styled('label')`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme!.gap.md};
`;
