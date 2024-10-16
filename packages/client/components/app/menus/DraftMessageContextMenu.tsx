import MdClose from '@material-design-icons/svg/outlined/close.svg?component-solid';
import MdDelete from '@material-design-icons/svg/outlined/delete.svg?component-solid';
import MdRefresh from '@material-design-icons/svg/outlined/refresh.svg?component-solid';
import { useClient } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { state } from '@revolt/state';
import type { UnsentMessage } from '@revolt/state/stores/Draft';
import type { Channel } from 'revolt.js';
import { Show } from 'solid-js';

import { ContextMenu, ContextMenuButton } from './ContextMenu';

interface Props {
  draft: UnsentMessage;
  channel: Channel;
}

/**
 * Context menu for draft messages
 */
export function DraftMessageContextMenu(props: Props) {
  const client = useClient();
  const t = useTranslation();

  /**
   * Retry sending the draft message
   */
  function retrySend(ev: MouseEvent) {
    state.draft.retrySend(client(), props.channel, props.draft.idempotencyKey);
  }

  /**
   * Delete the draft message
   */
  function deleteMessage(ev: MouseEvent) {
    state.draft.cancelSend(props.channel, props.draft.idempotencyKey);
  }

  return (
    <Show when={props.draft.status !== 'sending'}>
      <ContextMenu>
        <Show when={false}>
          <ContextMenuButton icon={MdClose} onClick={deleteMessage} destructive>
            {t('app.context_menu.cancel_message')}
          </ContextMenuButton>
        </Show>
        <Show
          when={
            props.draft.status === 'failed' || props.draft.status === 'unsent'
          }
        >
          <ContextMenuButton icon={MdRefresh} onClick={retrySend}>
            {t('app.context_menu.retry_message')}
          </ContextMenuButton>
          <ContextMenuButton
            icon={MdDelete}
            onClick={deleteMessage}
            destructive
          >
            {t('app.context_menu.delete_message')}
          </ContextMenuButton>
        </Show>
      </ContextMenu>
    </Show>
  );
}
