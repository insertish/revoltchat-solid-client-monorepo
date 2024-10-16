import MdBadge from '@material-design-icons/svg/outlined/badge.svg?component-solid';
import MdContentCopy from '@material-design-icons/svg/outlined/content_copy.svg?component-solid';
import MdDelete from '@material-design-icons/svg/outlined/delete.svg?component-solid';
import MdMarkChatUnread from '@material-design-icons/svg/outlined/mark_chat_unread.svg?component-solid';
import MdReply from '@material-design-icons/svg/outlined/reply.svg?component-solid';
import MdReport from '@material-design-icons/svg/outlined/report.svg?component-solid';
import MdShare from '@material-design-icons/svg/outlined/share.svg?component-solid';
import MdShield from '@material-design-icons/svg/outlined/shield.svg?component-solid';
import { useClient, useUser } from '@revolt/client';
import { getController } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import { state } from '@revolt/state';
import type { Message } from 'revolt.js';
import { Show } from 'solid-js';

import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuDivider,
} from './ContextMenu';

/**
 * Context menu for messages
 */
export function MessageContextMenu(props: { message: Message }) {
  const user = useUser();
  const client = useClient();
  const t = useTranslation();

  /**
   * Reply to this message
   */
  function reply() {
    state.draft.addReply(props.message, user()!.id);
  }

  /**
   * Mark message as unread
   */
  function markAsUnread() {
    props.message.ack();
  }

  /**
   * Copy message contents to clipboard
   */
  function copyText() {
    navigator.clipboard.writeText(props.message.content);
  }

  /**
   * Report the message
   */
  function report() {
    getController('modal').push({
      type: 'report_content',
      target: props.message,
      client: client(),
    });
  }

  /**
   * Delete the message
   */
  function deleteMessage(ev: MouseEvent) {
    if (ev.shiftKey) {
      props.message.delete();
    } else {
      getController('modal').push({
        type: 'delete_message',
        message: props.message,
      });
    }
  }

  /**
   * Open message in Revolt Admin Panel
   */
  function openAdminPanel() {
    window.open(
      `https://admin.revolt.chat/panel/inspect/message/${props.message.id}`,
      '_blank'
    );
  }

  /**
   * Copy message link to clipboard
   */
  function copyLink() {
    navigator.clipboard.writeText(
      `${location.origin}${
        props.message.server ? `/server/${props.message.server?.id}` : ''
      }/channel/${props.message.channelId}/${props.message.id}`
    );
  }

  /**
   * Copy message id to clipboard
   */
  function copyId() {
    navigator.clipboard.writeText(props.message.id);
  }

  return (
    <ContextMenu>
      <ContextMenuButton icon={MdReply} onClick={reply}>
        {t('app.context_menu.reply_message')}
      </ContextMenuButton>
      <ContextMenuButton icon={MdMarkChatUnread} onClick={markAsUnread}>
        {t('app.context_menu.mark_unread')}
      </ContextMenuButton>
      <ContextMenuButton icon={MdContentCopy} onClick={copyText}>
        {t('app.context_menu.copy_text')}
      </ContextMenuButton>
      <ContextMenuDivider />
      <Show when={!props.message.author?.self}>
        <ContextMenuButton icon={MdReport} onClick={report} destructive>
          {t('app.context_menu.report_message')}
        </ContextMenuButton>
      </Show>
      <Show
        when={
          props.message.author?.self ||
          props.message.channel?.havePermission('ManageMessages')
        }
      >
        <ContextMenuButton icon={MdDelete} onClick={deleteMessage} destructive>
          {t('app.context_menu.delete_message')}
        </ContextMenuButton>
      </Show>
      <ContextMenuDivider />
      <ContextMenuButton icon={MdShield} onClick={openAdminPanel}>
        Admin Panel
      </ContextMenuButton>
      <ContextMenuButton icon={MdShare} onClick={copyLink}>
        {t('app.context_menu.copy_link')}
      </ContextMenuButton>
      <ContextMenuButton icon={MdBadge} onClick={copyId}>
        {t('app.context_menu.copy_mid')}
      </ContextMenuButton>
    </ContextMenu>
  );
}
