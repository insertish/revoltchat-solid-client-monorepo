import { styled } from 'solid-styled-components';

import { Row } from '../../layout';
import { generateTypographyCSS } from '../display/Typography';

/**
 * Chip (M3)
 */
export const Chip = styled(Row)`
  align-items: center;
  flex-shrink: 0;
  ${(props) => generateTypographyCSS(props.theme!, 'chip')}

  gap: ${(props) => props.theme!.gap.s};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours['component-chip-background']};
  padding: ${(props) => props.theme!.gap.sm} ${(props) => props.theme!.gap.s};
`;
