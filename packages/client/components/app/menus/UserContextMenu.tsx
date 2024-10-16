import MdAddCircleOutline from '@material-design-icons/svg/outlined/add_circle_outline.svg?component-solid';
import MdAdminPanelSettings from '@material-design-icons/svg/outlined/admin_panel_settings.svg?component-solid';
import MdAlternateEmail from '@material-design-icons/svg/outlined/alternate_email.svg?component-solid';
import MdBadge from '@material-design-icons/svg/outlined/badge.svg?component-solid';
import MdBlock from '@material-design-icons/svg/outlined/block.svg?component-solid';
import MdCancel from '@material-design-icons/svg/outlined/cancel.svg?component-solid';
import MdClose from '@material-design-icons/svg/outlined/close.svg?component-solid';
import MdDoNotDisturbOn from '@material-design-icons/svg/outlined/do_not_disturb_on.svg?component-solid';
import MdFace from '@material-design-icons/svg/outlined/face.svg?component-solid';
import MdPersonAddAlt from '@material-design-icons/svg/outlined/person_add_alt.svg?component-solid';
import MdPersonRemove from '@material-design-icons/svg/outlined/person_remove.svg?component-solid';
import MdReport from '@material-design-icons/svg/outlined/report.svg?component-solid';
import { useClient } from '@revolt/client';
import { getController } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import type { Channel, Message, ServerMember, User } from 'revolt.js';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuDivider,
} from './ContextMenu';

/**
 * Context menu for users
 */
export function UserContextMenu(props: {
  user: User;
  channel?: Channel;
  member?: ServerMember;
  contextMessage?: Message;
}) {
  // TODO: if we take serverId instead, we could dynamically fetch server member here
  // same for the floating menu I guess?
  const client = useClient();
  const t = useTranslation();

  /**
   * Delete channel
   */
  function closeDm() {
    getController('modal').push({
      type: 'delete_channel',
      channel: props.channel!,
    });
  }

  /**
   * Mention the user
   */
  function mention() {
    getController('state').draft.insertText(props.user.toString());
  }

  /**
   * Edit server identity for user
   */
  function editIdentity() {
    getController('modal').push({
      type: 'server_identity',
      member: props.member!,
    });
  }

  /**
   * Report the user
   */
  function reportUser() {
    getController('modal').push({
      type: 'report_content',
      target: props.user!,
      client: client(),
      contextMessage: props.contextMessage,
    });
  }

  /**
   * Kick the member
   */
  function kickMember() {
    getController('modal').push({
      type: 'kick_member',
      member: props.member!,
    });
  }

  /**
   * Ban the member
   */
  function banMember() {
    getController('modal').push({
      type: 'ban_member',
      member: props.member!,
    });
  }

  /**
   * Add friend
   */
  function addFriend() {
    props.user.addFriend();
  }

  /**
   * Remove friend
   */
  function removeFriend() {
    props.user.removeFriend();
  }

  /**
   * Block user
   */
  function blockUser() {
    props.user.blockUser();
  }

  /**
   * Unblock user
   */
  function unblockUser() {
    props.user.unblockUser();
  }

  /**
   * Open user in Revolt Admin Panel
   */
  function openAdminPanel() {
    window.open(
      `https://admin.revolt.chat/panel/inspect/user/${props.user.id}`,
      '_blank'
    );
  }

  /**
   * Copy user id to clipboard
   */
  function copyId() {
    navigator.clipboard.writeText(props.user.id);
  }

  return (
    <ContextMenu>
      <Show when={props.channel}>
        <ContextMenuButton icon={MdClose} onClick={closeDm}>
          {t('app.context_menu.close_dm')}
        </ContextMenuButton>
      </Show>
      <Show when={!props.channel}>
        <ContextMenuButton icon={MdAlternateEmail} onClick={mention}>
          {t('app.context_menu.mention')}
        </ContextMenuButton>
      </Show>
      <ContextMenuDivider />

      <Show
        when={
          props.member &&
          (props.user.self
            ? props.member!.server!.havePermission('ChangeNickname') ||
              props.member!.server!.havePermission('ChangeAvatar')
            : (props.member!.server!.havePermission('ManageNicknames') ||
                props.member!.server!.havePermission('RemoveAvatars')) &&
              props.member!.inferiorTo(props.member!.server!.member!))
        }
      >
        <ContextMenuButton icon={MdFace} onClick={editIdentity}>
          {t(
            `app.context_menu.${
              props.user.self ? 'edit_your_identity' : 'edit_identity'
            }`
          )}
        </ContextMenuButton>
      </Show>
      <Show when={props.member}>
        {/** TODO: #287 timeout users */}
        <Show
          when={
            !props.user.self &&
            props.member?.server?.havePermission('KickMembers') &&
            props.member.inferiorTo(props.member.server.member!)
          }
        >
          <ContextMenuButton
            icon={MdPersonRemove}
            onClick={kickMember}
            destructive
          >
            {t('app.context_menu.kick_member')}
          </ContextMenuButton>
        </Show>
        <Show
          when={
            !props.user.self &&
            props.member?.server?.havePermission('BanMembers') &&
            props.member.inferiorTo(props.member.server.member!)
          }
        >
          <ContextMenuButton
            icon={MdDoNotDisturbOn}
            onClick={banMember}
            destructive
          >
            {t('app.context_menu.ban_member')}
          </ContextMenuButton>
        </Show>
      </Show>
      <Show when={props.member}>
        <ContextMenuDivider />
      </Show>

      <Show when={!props.user.self}>
        <ContextMenuButton icon={MdReport} onClick={reportUser} destructive>
          {t('app.context_menu.report_user')}
        </ContextMenuButton>
        {/* TODO: #286 show profile / message */}
        <Show when={props.user.relationship === 'None' && !props.user.bot}>
          <ContextMenuButton icon={MdPersonAddAlt} onClick={addFriend}>
            {t('app.context_menu.add_friend')}
          </ContextMenuButton>
        </Show>
        <Show when={props.user.relationship === 'Friend'}>
          <ContextMenuButton icon={MdPersonRemove} onClick={removeFriend}>
            {t('app.context_menu.remove_friend')}
          </ContextMenuButton>
        </Show>
        <Show when={props.user.relationship === 'Incoming'}>
          <ContextMenuButton icon={MdPersonAddAlt} onClick={addFriend}>
            {t('app.context_menu.accept_friend')}
          </ContextMenuButton>
        </Show>
        <Show when={props.user.relationship === 'Incoming'}>
          <ContextMenuButton icon={MdCancel} onClick={removeFriend}>
            {t('app.context_menu.reject_friend')}
          </ContextMenuButton>
        </Show>
        <Show when={props.user.relationship === 'Outgoing'}>
          <ContextMenuButton icon={MdCancel} onClick={removeFriend}>
            {t('app.context_menu.cancel_friend')}
          </ContextMenuButton>
        </Show>
        <Show when={props.user.relationship !== 'Blocked'}>
          <ContextMenuButton icon={MdBlock} onClick={blockUser}>
            {t('app.context_menu.block_user')}
          </ContextMenuButton>
        </Show>
        <Show when={props.user.relationship === 'Blocked'}>
          <ContextMenuButton icon={MdAddCircleOutline} onClick={unblockUser}>
            {t('app.context_menu.unblock_user')}
          </ContextMenuButton>
        </Show>
        <ContextMenuDivider />
      </Show>

      <ContextMenuButton icon={MdAdminPanelSettings} onClick={openAdminPanel}>
        Admin Panel
      </ContextMenuButton>
      <ContextMenuButton icon={MdBadge} onClick={copyId}>
        {t('app.context_menu.copy_uid')}
      </ContextMenuButton>
    </ContextMenu>
  );
}

/**
 * Provide floating user menus on this element
 * @param user User
 * @param member Server Member
 */
export function floatingUserMenus(
  user: User,
  member?: ServerMember,
  contextMessage?: Message
): JSX.Directives['floating'] & object {
  return {
    userCard: {
      user,
      member,
      // we could use message to display masquerade info in user card
    },
    /**
     * Build user context menu
     */
    contextMenu() {
      return (
        <UserContextMenu
          user={user}
          member={member}
          contextMessage={contextMessage}
        />
      );
    },
  };
}

export function floatingUserMenusFromMessage(message: Message) {
  return floatingUserMenus(message.author!, message.member, message);
}
