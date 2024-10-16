import { styled } from 'solid-styled-components';

export interface Props {
  /**
   * Colour scheme
   */
  readonly palette?: 'primary' | 'secondary';

  /**
   * Whether a submission has been tried and errors should display on the input
   */
  readonly submissionTried?: boolean;
}

/**
 * Input element
 */
export const Input = styled('input')<Props>`
  width: 100%;
  margin: 0.2em 0;
  padding: 0.75em 1em;

  font-size: 0.9375rem;
  font-family: inherit;
  font-weight: 500;

  outline: none;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme!.borderRadius.md};

  transition: ${(props) => props.theme!.transitions.fast} all;

  &:disabled {
    filter: brightness(0.9);
  }

  &:focus-visible {
    box-shadow: 0 0 0 1.5pt
      ${({ theme }) => theme!.colours['component-input-focus']};
  }

  color: ${(props) => props.theme!.colours['component-input-foreground']};

  background: ${(props) =>
    props.theme!.colours[
      `component-input-background-${props.palette ?? 'primary'}`
    ]};

  &:hover {
    background: ${(props) =>
      props.theme!.colours[
        `component-input-hover-${props.palette ?? 'primary'}`
      ]};
  }

  ${(props) =>
    props.submissionTried
      ? `&:invalid { border-color: ${props.theme!.customColours.error.color}; }`
      : ''}

  &:focus {
    outline-offset: 4px;
    border-color: ${(props) => props.theme!.customColours.warning.color};
  }

  &:valid {
    border-color: transparent;
  }

  /* Override Chrome's ugly autofill colours */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px
      ${(props) =>
        props.theme!.colours[
          `component-input-background-${props.palette ?? 'primary'}`
        ]}
      inset !important;
  }

  &:-webkit-autofill {
    caret-color: ${(props) =>
      props.theme!.colours['component-input-foreground']} !important;
    -webkit-text-fill-color: ${(props) =>
      props.theme!.colours['component-input-foreground']} !important;
  }
`;
