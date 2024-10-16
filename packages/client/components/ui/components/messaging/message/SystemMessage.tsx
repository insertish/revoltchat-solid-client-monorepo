import type {
  ChannelEditSystemMessage,
  ChannelOwnershipChangeSystemMessage,
  ChannelRenamedSystemMessage,
  SystemMessage as SystemMessageClass,
  TextSystemMessage,
  User,
  UserModeratedSystemMessage,
  UserSystemMessage,
} from 'revolt.js';
import type { JSX } from 'solid-js';
import { Match, Switch } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Typography } from '../../design';

interface Props {
  /**
   * System Message
   */
  systemMessage: SystemMessageClass;

  /**
   * Menu generator
   */
  menuGenerator: (user?: User) => JSX.Directives['floating'];

  /**
   * Whether this is rendered within a server
   */
  isServer: boolean;
}

/**
 * Render the actual user
 */
function Usr(props: { user?: User } & Pick<Props, 'menuGenerator'>) {
  return (
    <Username use:floating={props.menuGenerator(props.user)}>
      {props.user?.username}
    </Username>
  );
}

/**
 * System Message
 */
export function SystemMessage(props: Props) {
  // TODO: i18n with components
  return (
    <Base>
      <Typography variant='system-message'>
        <Switch fallback={props.systemMessage.type}>
          <Match when={props.systemMessage.type === 'user_added'}>
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserModeratedSystemMessage).user}
            />{' '}
            has been added by{' '}
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserModeratedSystemMessage).by}
            />
          </Match>
          <Match
            when={props.systemMessage.type === 'user_left' && !props.isServer}
          >
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserSystemMessage).user}
            />{' '}
            left the group
          </Match>
          <Match when={props.systemMessage.type === 'user_remove'}>
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserModeratedSystemMessage).user}
            />{' '}
            has been removed by{' '}
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserModeratedSystemMessage).by}
            />
          </Match>
          <Match when={props.systemMessage.type === 'user_kicked'}>
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserSystemMessage).user}
            />{' '}
            has been kicked from the server
          </Match>
          <Match when={props.systemMessage.type === 'user_banned'}>
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserSystemMessage).user}
            />{' '}
            has been banned from the server
          </Match>
          <Match when={props.systemMessage.type === 'user_joined'}>
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserSystemMessage).user}
            />{' '}
            joined the server
          </Match>
          <Match
            when={props.systemMessage.type === 'user_left' && props.isServer}
          >
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as UserSystemMessage).user}
            />{' '}
            left the server
          </Match>
          <Match when={props.systemMessage.type === 'channel_renamed'}>
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as ChannelRenamedSystemMessage).by}
            />{' '}
            updated the group name to{' '}
            <Username>
              {(props.systemMessage as ChannelRenamedSystemMessage).name}
            </Username>
          </Match>
          <Match
            when={props.systemMessage.type === 'channel_description_changed'}
          >
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as ChannelEditSystemMessage).by}
            />{' '}
            updated the group description
          </Match>
          <Match when={props.systemMessage.type === 'channel_icon_changed'}>
            <Usr
              menuGenerator={props.menuGenerator}
              user={(props.systemMessage as ChannelEditSystemMessage).by}
            />{' '}
            updated the group icon
          </Match>
          <Match
            when={props.systemMessage.type === 'channel_ownership_changed'}
          >
            <Usr
              menuGenerator={props.menuGenerator}
              user={
                (props.systemMessage as ChannelOwnershipChangeSystemMessage)
                  .from
              }
            />{' '}
            transferred group ownership to{' '}
            <Usr
              menuGenerator={props.menuGenerator}
              user={
                (props.systemMessage as ChannelOwnershipChangeSystemMessage).to
              }
            />
          </Match>
          <Match when={props.systemMessage.type === 'text'}>
            {(props.systemMessage as TextSystemMessage).content}
          </Match>
        </Switch>
      </Typography>
    </Base>
  );
}

const Base = styled('div', 'SystemMessage')`
  display: flex;
  min-height: 20px;
  align-items: center;
  color: var(--unset-fg);
`;

const Username = styled.span`
  color: ${(props) => props.theme!.colours['foreground']};
`;
