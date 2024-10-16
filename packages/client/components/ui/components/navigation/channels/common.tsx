import { styled } from 'solid-styled-components';

/**
 * Common styles for sidebar
 */
export const SidebarBase = styled('div', 'Sidebar')`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;

  overflow: hidden;
  border-radius: ${(props) => props.theme!.borderRadius.lg};
  margin: ${(props) => (props.theme!.gap.md + ' ').repeat(3)}0;
  width: ${(props) => props.theme!.layout.width['channel-sidebar']};

  color: ${({ theme }) => theme!.colours['sidebar-channels-foreground']};
  background: ${({ theme }) => theme!.colours['sidebar-channels-background']};

  a {
    text-decoration: none;
  }
`;
