import { iconSize, styled } from '@revolt/ui';
import type { Component, ComponentProps, JSX } from 'solid-js';
import { splitProps } from 'solid-js';

export const ContextMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme!.gap.md} 0;

  overflow: hidden;
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) =>
    props.theme!.colours['component-context-menu-background']};
  color: ${(props) =>
    props.theme!.colours['component-context-menu-foreground']};
  fill: ${(props) => props.theme!.colours['component-context-menu-foreground']};

  box-shadow: 0 0 3px
    ${(props) => props.theme!.colours['component-context-menu-shadow']};
`;

export const ContextMenuDivider = styled.div`
  height: 1px;
  margin: ${(props) => props.theme!.gap.sm} 0;
  background: ${(props) =>
    props.theme!.colours['component-context-menu-divider']};
`;

export const ContextMenuItem = styled('a', 'MenuItem')`
  display: block;
  padding: ${(props) => props.theme!.gap.md} ${(props) => props.theme!.gap.lg};

  &:hover {
    background: ${(props) =>
      props.theme!.colours['component-context-menu-item-hover-background']};
  }
`;

const ButtonBase = styled(ContextMenuItem)<{ destructive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme!.gap.md};

  text-transform: capitalize;

  > span {
    margin-top: 1px;
  }

  ${(props) =>
    props.destructive
      ? `fill: ${props.theme!.customColours.error.color}; color: ${
          props.theme!.customColours.error.color
        };`
      : ''}
`;

type ButtonProps = ComponentProps<typeof ContextMenuItem> & {
  icon?: Component<JSX.SvgSVGAttributes<SVGSVGElement>>;
  destructive?: boolean;
};

export function ContextMenuButton(props: ButtonProps) {
  const [local, remote] = splitProps(props, ['icon', 'children']);

  return (
    <ButtonBase {...remote}>
      {local.icon?.(iconSize('1.2em'))}
      <span>{local.children}</span>
    </ButtonBase>
  );
}
