import { styled } from 'solid-styled-components';

/**
 * Coloured text
 */
export const ColouredText = styled.span<{ colour?: string; clip?: boolean }>`
  color: ${(props) => props.colour ?? 'inherit'};
  background: ${(props) => (props.clip ? props.colour! : 'none')};
  -webkit-text-fill-color: ${(props) => (props.clip ? 'transparent' : 'unset')};
  background-clip: ${(props) => (props.clip ? 'text' : 'unset')};
  -webkit-background-clip: ${(props) => (props.clip ? 'text' : 'unset')};
  text-decoration: ${(props) => (props.clip ? 'none' : 'unset')} !important;
`;
