import { styled } from '@revolt/ui';

// TODO: move to @revolt/ui package

type Props = Record<never, never>;

/**
 * Sidebar button
 */
export const SidebarButton = styled.a<Props>`
  min-width: 0;

  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 8px;
  font-weight: 500;
  margin-inline-end: 12px;
  font-size: 15px;
  user-select: none;
  transition: background-color 0.1s ease-in-out;
  color: ${(props) => props.theme!.colours['settings-sidebar-foreground']};
  background: ${(props) =>
    props['aria-selected']
      ? props.theme!.colours['settings-sidebar-button-hover']
      : 'unset'};

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background-color: ${(props) =>
      props.theme!.colours['settings-sidebar-button-hover']};
  }

  &:active {
    background-color: ${(props) =>
      props.theme!.colours['settings-sidebar-button-active']};
  }
`;

export const SidebarButtonTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-grow: 1;
  min-width: 0;
  padding-inline-end: 8px;
`;

export const SidebarButtonContent = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const SidebarButtonIcon = styled.div`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 2px;
`;
