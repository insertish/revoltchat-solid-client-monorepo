import MdBadge from '@material-design-icons/svg/outlined/badge.svg?component-solid';
import MdDelete from '@material-design-icons/svg/outlined/delete.svg?component-solid';
import MdGroupAdd from '@material-design-icons/svg/outlined/group_add.svg?component-solid';
import MdLibraryAdd from '@material-design-icons/svg/outlined/library_add.svg?component-solid';
import MdLogout from '@material-design-icons/svg/outlined/logout.svg?component-solid';
import MdMarkChatRead from '@material-design-icons/svg/outlined/mark_chat_read.svg?component-solid';
import MdSettings from '@material-design-icons/svg/outlined/settings.svg?component-solid';
import MdShare from '@material-design-icons/svg/outlined/share.svg?component-solid';
import MdShield from '@material-design-icons/svg/outlined/shield.svg?component-solid';
import { getController } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import type { Channel } from 'revolt.js';
import { Show } from 'solid-js';

import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuDivider,
} from './ContextMenu';

/**
 * Context menu for channels
 */
export function ChannelContextMenu(props: { channel: Channel }) {
  const t = useTranslation();

  /**
   * Mark channel as read
   */
  function markAsRead() {
    props.channel.ack();
  }

  /**
   * Create a new invite
   */
  function createInvite() {
    getController('modal').push({
      type: 'create_invite',
      channel: props.channel,
    });
  }

  /**
   * Create a new channel
   */
  function createChannel() {
    getController('modal').push({
      type: 'create_channel',
      server: props.channel.server!,
    });
  }

  /**
   * Edit channel
   */
  function editChannel() {
    getController('modal').push({
      type: 'settings',
      config: 'channel',
      context: props.channel,
    });
  }

  /**
   * Delete channel
   */
  function deleteChannel() {
    getController('modal').push({
      type: 'delete_channel',
      channel: props.channel,
    });
  }

  /**
   * Open channel in Revolt Admin Panel
   */
  function openAdminPanel() {
    window.open(
      `https://admin.revolt.chat/panel/inspect/channel/${props.channel.id}`,
      '_blank'
    );
  }

  /**
   * Copy channel link to clipboard
   */
  function copyLink() {
    navigator.clipboard.writeText(
      `${location.origin}${
        props.channel.server ? `/server/${props.channel.server?.id}` : ''
      }/channel/${props.channel.id}`
    );
  }

  /**
   * Copy channel id to clipboard
   */
  function copyId() {
    navigator.clipboard.writeText(props.channel.id);
  }

  return (
    <ContextMenu>
      <Show
        when={
          props.channel.unread || props.channel.havePermission('InviteOthers')
        }
      >
        <Show when={props.channel.unread}>
          <ContextMenuButton icon={MdMarkChatRead} onClick={markAsRead}>
            {t('app.context_menu.mark_as_read')}
          </ContextMenuButton>
        </Show>
        <Show when={props.channel.havePermission('InviteOthers')}>
          <ContextMenuButton icon={MdGroupAdd} onClick={createInvite}>
            {t('app.context_menu.create_invite')}
          </ContextMenuButton>
        </Show>
        <ContextMenuDivider />
      </Show>

      <Show when={props.channel.server?.havePermission('ManageChannel')}>
        <ContextMenuButton icon={MdLibraryAdd} onClick={createChannel}>
          {t('app.context_menu.create_channel')}
        </ContextMenuButton>
      </Show>
      <Show when={props.channel.havePermission('ManageChannel')}>
        <ContextMenuButton icon={MdSettings} onClick={editChannel}>
          {t('app.context_menu.open_channel_settings')}
        </ContextMenuButton>
        <ContextMenuButton
          icon={props.channel.type === 'Group' ? MdLogout : MdDelete}
          onClick={deleteChannel}
          destructive
        >
          {t(
            props.channel.type === 'Group'
              ? 'app.context_menu.leave_group'
              : 'app.context_menu.delete_channel'
          )}
        </ContextMenuButton>
      </Show>

      <Show
        when={
          props.channel.server?.havePermission('ManageChannel') ||
          props.channel.havePermission('ManageChannel')
        }
      >
        <ContextMenuDivider />
      </Show>

      <ContextMenuButton icon={MdShield} onClick={openAdminPanel}>
        Admin Panel
      </ContextMenuButton>
      <ContextMenuButton icon={MdShare} onClick={copyLink}>
        {t('app.context_menu.copy_link')}
      </ContextMenuButton>
      <ContextMenuButton icon={MdBadge} onClick={copyId}>
        {t('app.context_menu.copy_cid')}
      </ContextMenuButton>
    </ContextMenu>
  );
}
