import { state } from '@revolt/state';
import type { Channel } from 'revolt.js';
import { For } from 'solid-js';

import { DraftMessage } from './DraftMessage';

interface Props {
  channel: Channel;
}

/**
 *
 * @param props
 * @returns
 */
export function DraftMessages(props: Props) {
  const unsent = () =>
    state.draft
      .getPendingMessages(props.channel.id)
      .filter((draft) => draft.status === 'sending');

  const failed = () =>
    state.draft
      .getPendingMessages(props.channel.id)
      .filter((draft) => draft.status !== 'sending');

  return (
    <>
      <For each={unsent()}>
        {(draft, index) => (
          <DraftMessage
            draft={draft}
            channel={props.channel}
            tail={index() !== 0}
          />
        )}
      </For>
      <For each={failed()}>
        {(draft) => <DraftMessage draft={draft} channel={props.channel} />}
      </For>
    </>
  );
}
