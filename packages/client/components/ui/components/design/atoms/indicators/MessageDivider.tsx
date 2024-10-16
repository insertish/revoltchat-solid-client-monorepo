import { Show } from 'solid-js';
import { styled } from 'solid-styled-components';

/**
 * Divider line
 */
const Base = styled('div')<{ unread?: boolean }>`
  height: 0;
  display: flex;
  user-select: none;
  align-items: center;
  margin: 17px 12px 5px;

  time {
    margin-top: -2px;
    font-size: 0.6875rem;
    line-height: 0.6875rem;
    font-weight: 600;
    padding-inline: 5px 5px;

    border-radius: ${(props) => props.theme!.borderRadius.md};

    color: ${({ theme }) =>
      theme!.colours['messaging-component-message-divider-foreground']};
    background: ${({ theme }) => theme!.colours.background};
  }

  border-top: thin solid
    ${({ unread, theme }) =>
      theme!.colours[
        `messaging-component-message-divider${
          unread ? '-unread' : ''
        }-background`
      ]};
`;

/**
 * Unread indicator
 */
const Unread = styled('div')`
  font-size: 0.625rem;
  font-weight: 600;
  color: ${({ theme }) =>
    theme!.colours['messaging-component-message-divider-unread-foreground']};
  background: ${({ theme }) =>
    theme!.colours['messaging-component-message-divider-unread-background']};

  padding: 2px 6px;
  margin-top: -1px;
  border-radius: 60px;
`;

interface Props {
  /**
   * Display the date
   */
  date?: string;

  /**
   * Show unread indicator
   */
  unread?: boolean;
}

/**
 * Generic message divider
 */
export function MessageDivider(props: Props) {
  return (
    <Base unread={props.unread}>
      <Show when={props.unread}>
        <Unread>NEW</Unread>
      </Show>
      <Show when={props.date}>
        <time>{props.date}</time>
      </Show>
    </Base>
  );
}
