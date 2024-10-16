import { styled } from 'solid-styled-components';

/**
 * Dropdown element
 */
export const ComboBox = styled('select')`
  padding: 4px;
  height: fit-content;

  font-weight: 500;
  font-size: 0.9375rem;
  font-family: inherit;

  color: ${({ theme }) => theme!.colours['component-combo-foreground']};
  background: ${({ theme }) => theme!.colours['component-combo-background']};

  box-sizing: border-box;
  border-radius: ${({ theme }) => theme!.borderRadius.md};
  border: 2px solid
    ${({ theme }) => theme!.colours['component-combo-foreground']};

  outline: none;
  cursor: pointer;

  &:focus-visible {
    box-shadow: 0 0 0 1.5pt
      ${({ theme }) => theme!.colours['component-combo-focus']};
  }
`; // TODO: re-do this and Input to work like Button
