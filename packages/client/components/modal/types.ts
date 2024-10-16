import type { SettingsConfigurations } from '@revolt/app';
import type { KeybindAction, KeyComboSequence } from '@revolt/keybinds';
import type { Modal } from '@revolt/ui';
import type {
  API,
  Bot,
  Channel,
  Client,
  File,
  Message,
  MFA,
  MFATicket,
  Server,
  ServerMember,
  Session,
  User,
} from 'revolt.js';
import type { ComponentProps, JSX } from 'solid-js';

import type { ChangelogPost } from './modals/Changelog';

export type Modals =
  | {
      type:
        | 'add_friend'
        | 'create_group'
        | 'create_or_join_server'
        | 'create_server'
        | 'join_server'
        | 'custom_status'
        | 'edit_username'
        | 'edit_email'
        | 'edit_password';
      client: Client;
    }
  | {
      type: 'edit_display_name';
      user: User;
    }
  | {
      type: 'rename_session';
      session: Session;
    }
  | {
      type: 'report_content';
      client: Client;
      target: Server | User | Message;
      contextMessage?: Message;
    }
  | {
      type: 'report_success';
      user?: User;
    }
  | {
      type: 'signed_out';
    }
  | ({
      type: 'mfa_flow';
    } & (
      | {
          mfa: MFA;
          state: 'known';
          callback: (ticket?: MFATicket) => void;
        }
      | {
          state: 'unknown';
          available_methods: API.MFAMethod[];
          callback: (response?: API.MFAResponse) => void;
        }
    ))
  | { type: 'mfa_recovery'; codes: string[]; mfa: MFA }
  | {
      type: 'mfa_enable_totp';
      identifier: string;
      secret: string;
      callback: (code?: string) => void;
    }
  | {
      type: 'out_of_date';
      version: string;
    }
  | {
      type: 'changelog';
      initial?: number;
      posts: ChangelogPost[];
    }
  | {
      type: 'sign_out_sessions';
      client: Client;
    }
  | {
      type: 'show_token';
      name: string;
      token: string;
    }
  | {
      type: 'error';
      error: string;
    }
  | {
      type: 'clipboard';
      text: string;
    }
  | {
      type: 'link_warning';
      link: string;
      callback: () => true;
    }
  | {
      type: 'pending_friend_requests';
      users: User[];
    }
  | {
      type: 'modify_account';
      client: Client;
      field: 'username' | 'email' | 'password';
    }
  | {
      type: 'server_identity';
      member: ServerMember;
    }
  | {
      type: 'channel_info';
      channel: Channel;
    }
  | {
      type: 'server_info';
      server: Server;
    }
  | {
      type: 'image_viewer';
      embed?: API.Image;
      file?: File;
    }
  | {
      type: 'user_picker';
      omit?: string[];
      callback: (users: string[]) => Promise<void>;
    }
  | {
      type: 'user_profile';
      user_id: string;
      isPlaceholder?: boolean;
      placeholderProfile?: API.UserProfile;
    }
  | {
      type: 'create_bot';
      client: Client;
      onCreate: (bot: Bot) => void;
    }
  | {
      type: 'onboarding';
      callback: (username: string, loginAfterSuccess?: true) => Promise<void>;
    }
  | {
      type: 'create_role';
      server: Server;
      callback: (id: string) => void;
    }
  | {
      type: 'leave_group';
      channel: Channel;
    }
  | {
      type: 'close_dm';
      channel: Channel;
    }
  | {
      type: 'delete_channel';
      channel: Channel;
    }
  | {
      type: 'create_invite';
      channel: Channel;
    }
  | {
      type: 'leave_server';
      server: Server;
    }
  | {
      type: 'delete_server';
      server: Server;
    }
  | {
      type: 'delete_bot';
      bot: Bot;
    }
  | {
      type: 'delete_message';
      message: Message;
    }
  | {
      type: 'kick_member';
      member: ServerMember;
    }
  | {
      type: 'ban_member';
      member: ServerMember;
    }
  | {
      type: 'unfriend_user';
      user: User;
    }
  | {
      type: 'block_user';
      user: User;
    }
  | {
      type: 'create_channel';
      server: Server;
      cb?: (channel: Channel) => void;
    }
  | {
      type: 'create_category';
      server: Server;
    }
  | {
      type: 'import_theme';
    }
  | {
      type: 'settings';
      config: keyof typeof SettingsConfigurations;
      // eslint-disable-next-line
      context?: any;
    }
  | {
      type: 'edit_keybind';
      action: KeybindAction;
      onSubmit: (sequence: KeyComboSequence) => void;
    };

export type ModalProps<T extends Modals['type']> = Modals & { type: T };
export type ReturnType =
  | ComponentProps<typeof Modal>
  | {
      _children: (props: { show: boolean; onClose: () => void }) => JSX.Element;
    };
export type PropGenerator<T extends Modals['type']> = (
  props: ModalProps<T>,
  onClose: () => void
) => ReturnType;
