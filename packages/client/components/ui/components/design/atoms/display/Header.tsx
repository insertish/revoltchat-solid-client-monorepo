import { styled } from 'solid-styled-components';

export interface Props {
  readonly placement: 'primary' | 'secondary';

  readonly topBorder?: boolean;
  readonly bottomBorder?: boolean;
}

/**
 * Generic header component
 */
export const Header = styled('div', 'Header')<Props>`
  gap: 10px;
  flex: 0 auto;
  display: flex;
  flex-shrink: 0;
  padding: 0 16px;
  align-items: center;

  font-weight: 600;
  user-select: none;

  margin: ${(props) =>
    props.placement === 'primary'
      ? (props.theme!.gap.md + ' ').repeat(3) + '0'
      : ''};
  overflow: hidden;
  height: ${(props) => props.theme!.layout.height.header};
  border-radius: ${(props) => props.theme!.borderRadius.lg};

  color: ${(props) => props.theme!.colours['sidebar-header-foreground']};
  background-color: ${(props) =>
    props.theme!.colours['sidebar-header-background']};

  svg {
    flex-shrink: 0;
  }

  background-size: cover !important;
  background-position: center !important;
`;

/**
 * Position an element below a floating header
 *
 * Ensure you place a div inside to make the positioning work
 */
export const BelowFloatingHeader = styled.div`
  position: relative;
  z-index: ${(props) => props.theme!.layout.zIndex['floating-bar']};

  > * {
    width: 100%;
    position: absolute;
    top: calc(
      2 * ${(props) => props.theme!.gap.md} +
        ${(props) => props.theme!.layout.height.header}
    );
  }
`;

/**
 * Header with background transparency
 */
export const HeaderWithTransparency = styled(Header)`
  background-color: ${(props) =>
    props.theme!.colours['sidebar-header-transparent-background']};
  backdrop-filter: ${(props) => props.theme!.effects.blur.md};

  position: absolute;
  width: calc(100% - ${(props) => props.theme!.gap.md});
  z-index: ${(props) => props.theme!.layout.zIndex['floating-bar']};
`;

/**
 * Header with background image
 */
export const HeaderWithImage = styled(Header)`
  padding: 0;
  align-items: flex-end;
  justify-content: stretch;
  text-shadow: 0px 0px 1px ${(props) => props.theme!.colours.foreground};
  height: ${(props) => props.theme!.layout.height['tall-header']};
  margin: ${(props) => props.theme!.gap.md};

  > * {
    flex-grow: 1;
    padding: 6px 14px;
    color: ${(props) =>
      props.theme!.colours['sidebar-header-with-image-text-foreground']};
    background: linear-gradient(
      0deg,
      ${(props) =>
        props.theme!.colours['sidebar-header-with-image-text-background']},
      transparent
    );
  }
`;
