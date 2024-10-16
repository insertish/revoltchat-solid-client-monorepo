import MdClose from '@material-design-icons/svg/outlined/close.svg?component-solid';
import { Breadcrumbs, Column, iconSize, styled, Typography } from '@revolt/ui';
import type { Accessor, JSX } from 'solid-js';
import { Show } from 'solid-js';
import { cva } from 'styled-system/css';

import { useSettingsNavigation } from '../Settings';

/**
 * Content portion of the settings menu
 */
export function SettingsContent(props: {
  onClose?: () => void;
  children: JSX.Element;
  title: (key: string) => string;
  page: Accessor<string | undefined>;
}) {
  const { navigate } = useSettingsNavigation();

  return (
    <div
      use:scrollable={{
        foreground: 'var(--colours-settings-content-scroll-thumb)',
        background: 'var(--colours-settings-content-background)',
        class: base(),
      }}
    >
      <Show when={props.page()}>
        <InnerContent>
          <InnerColumn gap='x'>
            <Typography variant='settings-title'>
              <Breadcrumbs
                elements={props.page()!.split('/')}
                renderElement={(key) => props.title(key)}
                navigate={(keys) => navigate(keys.join('/'))}
              />
            </Typography>
            {props.children}
          </InnerColumn>
        </InnerContent>
      </Show>
      <Show when={props.onClose}>
        <CloseAction>
          <CloseAnchor onClick={props.onClose}>
            <MdClose {...iconSize(28)} />
          </CloseAnchor>
        </CloseAction>
      </Show>
    </div>
  );
}

/**
 * Base styles
 */
const base = cva({
  base: {
    minWidth: 0,
    flex: '1 1 800px',
    flexDirection: 'row',

    display: 'flex',
    background: 'var(--colours-settings-content-background)',

    borderStartStartRadius: '30px',
    borderEndStartRadius: '30px',

    '& > a': {
      textDecoration: 'none',
    },
  },
});

/**
 * Settings pane
 */
const InnerContent = styled('div', 'Pane')`
  gap: 13px;
  min-width: 0;
  width: 100%;
  display: flex;
  max-width: 740px;
  padding: 80px 32px;
  justify-content: stretch;
  z-index: 1;
`;

/**
 * Pane content column
 */
const InnerColumn = styled(Column)`
  width: 100%;
`;

/**
 * Button for closing settings page
 */
const CloseAnchor = styled.a`
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: ${(props) => props.theme!.borderRadius.full};
  border: 3px solid ${(props) => props.theme!.colours['settings-close-anchor']};
  transition: ${(props) => props.theme!.transitions.fast} background-color;

  svg {
    transition: ${(props) => props.theme!.transitions.fast} background-color;
    color: ${(props) =>
      props.theme!.colours['settings-close-anchor']} !important;
  }

  &:hover {
    background: ${(props) => props.theme!.colours['settings-close-anchor']};
  }

  &:hover svg {
    color: ${(props) =>
      props.theme!.colours['settings-close-anchor-hover']} !important;
  }

  &:active {
    transform: translateY(2px);
  }
`;

/**
 * Positioning for close button
 */
const CloseAction = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  padding: 80px 8px;
  visibility: visible;
  position: sticky;
  top: 0;

  &:after {
    content: 'ESC';
    margin-top: 4px;
    display: flex;
    justify-content: center;
    width: 36px;
    font-weight: 600;
    color: ${(props) => props.theme!.colours['settings-content-foreground']};
    font-size: 0.75rem;
  }
`;
