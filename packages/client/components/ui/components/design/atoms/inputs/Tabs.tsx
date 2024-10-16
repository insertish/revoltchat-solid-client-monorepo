import { BiSolidXCircle } from 'solid-icons/bi';
import type { Accessor, JSX } from 'solid-js';
import { For } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Row } from '../../layout';

interface Props {
  /**
   * Tabs to display in element
   */
  readonly tabs: () => Record<
    string,
    { label: JSX.Element; dismissable?: boolean }
  >;

  /**
   * Current tab
   */
  readonly tab: Accessor<string>;

  /**
   * Select a new tab
   * @param tab Tab
   */
  readonly onSelect: (tab: string) => void;

  /**
   * Dismiss a tab
   * @param tab Tab
   */
  readonly onDismiss?: (tab: string) => void;
}

/**
 * Base container of rows
 */
const Base = styled(Row)`
  flex-wrap: wrap;
  background: var(--unset-bg);
`;

/**
 * Single tab entry
 */
const Tab = styled.a<{ active: boolean }>`
  gap: 4px;
  display: flex;
  align-items: center;

  cursor: pointer;
  user-select: none;
  padding: 0.4em 1em;
  border-top: 4px solid transparent;
  border-bottom: 4px solid
    ${(props) => (props.active ? 'var(--unset-fg)' : 'transparent')};
  color: ${(props) => props.theme!.colours['foreground']};
  background: var(--unset-bg);
  transition: ${(props) => props.theme!.transitions.fast};

  &:hover {
    filter: brightness(1.2);
    color: ${(props) => props.theme!.colours['foreground']};
  }
`;

/**
 * Dismiss tab button
 */
const Dismiss = styled.a`
  height: 16px;
  display: block;
`;

/**
 * Component for displaying an interactive list of tabs
 */
export function Tabs(props: Props) {
  return (
    <Base role='tablist' gap='none'>
      <For each={Object.keys(props.tabs())}>
        {(tab) => {
          /**
           * Whether this tab is active
           */
          const active = () => props.tab() === tab;

          /**
           * The corresponding tab entry
           */
          const entry = () => props.tabs()[tab];

          /**
           * Handle mouse down event
           * @param event Event
           */
          function onMouseDown(event: MouseEvent) {
            if (event.button === 1) {
              event.preventDefault();
              props.onDismiss?.(tab);
            } else if (event.button === 0) {
              props.onSelect(tab);
            }
          }

          /**
           * Dismiss the tab
           * @param event Event
           */
          function dismiss(event: MouseEvent) {
            event.stopPropagation();
            props.onDismiss?.(tab);
          }

          return (
            <Tab
              role='tab'
              aria-selected={active()}
              active={active()}
              onMouseDown={onMouseDown}
            >
              {entry().label}
              {entry().dismissable && (
                <Dismiss onClick={dismiss}>
                  <BiSolidXCircle size={16} />
                </Dismiss>
              )}
            </Tab>
          );
        }}
      </For>
    </Base>
  );
}
