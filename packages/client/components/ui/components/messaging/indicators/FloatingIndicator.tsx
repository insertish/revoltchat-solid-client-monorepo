import { styled } from 'solid-styled-components';

import { generateTypographyCSS } from '../../design/atoms/display/Typography';

/**
 * Common styles for the floating indicators
 */
export const FloatingIndicator = styled('div', 'FloatingIndicator')<{
  position: 'top' | 'bottom';
}>`
  display: flex;
  user-select: none;
  align-items: center;

  width: 100%;
  gap: ${(props) => props.theme!.gap.md};
  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.lg};

  cursor: pointer;
  backdrop-filter: ${(props) => props.theme!.effects.blur.md};
  color: ${(props) => props.theme!.colours['messaging-indicator-foreground']};
  background-color: ${(props) =>
    props.theme!.colours['messaging-indicator-background']};

  ${(props) => generateTypographyCSS(props.theme!, 'conversation-indicator')}

  @keyframes anim {
    0% {
      transform: translateY(
        ${(props) => (props.position === 'top' ? '-33px' : '33px')}
      );
    }
    100% {
      transform: translateY(0px);
    }
  }

  animation: anim 340ms cubic-bezier(0.2, 0.9, 0.5, 1.16) forwards;
`;
