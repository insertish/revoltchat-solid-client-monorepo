import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';
import { styled } from 'solid-styled-components';

import { generateTypographyCSS } from '../design/atoms/display/Typography';

/**
 * Base element for the tooltip
 */
export const TooltipBase = styled('div', 'Tooltip')`
  color: white;
  background: black;
  ${(props) => generateTypographyCSS(props.theme!, 'tooltip')};

  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
`;

type Props = {
  /**
   * Tooltip trigger area
   */
  children: JSX.Element;
} & (JSX.Directives['floating'] & object)['tooltip'];

/**
 * Tooltip component
 */
export function Tooltip(props: Props) {
  const [local, remote] = splitProps(props, ['children']);

  return (
    <div
      use:floating={{
        tooltip: remote as never,
      }}
    >
      {local.children}
    </div>
  );
}
