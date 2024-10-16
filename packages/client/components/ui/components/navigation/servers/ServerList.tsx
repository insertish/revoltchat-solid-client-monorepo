import MdAdd from '@material-design-icons/svg/filled/add.svg?component-solid';
import MdExplore from '@material-design-icons/svg/filled/explore.svg?component-solid';
import MdHome from '@material-design-icons/svg/filled/home.svg?component-solid';
import MdSettings from '@material-design-icons/svg/filled/settings.svg?component-solid';
import { KeybindAction } from '@revolt/keybinds';
import { useNavigate } from '@revolt/routing';
import type { Channel, Server, User } from 'revolt.js';
import type { Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import { For, onCleanup, onMount, Show } from 'solid-js';
import { styled as styledLegacy } from 'solid-styled-components';
import { cva } from 'styled-system/css';
import { styled } from 'styled-system/jsx';

import { Draggable } from '../../common/Draggable';
import { useKeybindActions } from '../../context/Keybinds';
import { Column, Typography } from '../../design';
import { Avatar } from '../../design/atoms/display/Avatar';
import {
  UnreadsGraphic,
  UserStatusGraphic,
} from '../../design/atoms/indicators';
import { Tooltip } from '../../floating';
import { Swoosh } from './Swoosh';

interface Props {
  /**
   * Ordered server list
   */
  orderedServers: Server[];

  /**
   * Set server ordering
   * @param ids List of IDs
   */
  setServerOrder: (ids: string[]) => void;

  /**
   * Unread conversations list
   */
  unreadConversations: Channel[];

  /**
   * Current logged in user
   */
  user: User;

  /**
   * Selected server id
   */
  selectedServer: Accessor<string | undefined>;

  /**
   * Create or join server
   */
  onCreateOrJoinServer(): void;

  /**
   * Menu generator
   */
  menuGenerator: (target: Server | Channel) => JSX.Directives['floating'];
}

/**
 * Server list sidebar component
 */
export const ServerList = (props: Props) => {
  const navigate = useNavigate();
  const keybinds = useKeybindActions();

  const navigateServer = (ev: KeyboardEvent, byOffset: number) => {
    ev.preventDefault();

    const serverId = props.selectedServer();
    if (serverId == null && props.orderedServers.length) {
      if (byOffset === 1) {
        navigate(`/server/${props.orderedServers[0].id}`);
      } else {
        navigate(
          `/server/${props.orderedServers[props.orderedServers.length - 1].id}`
        );
      }
      return;
    }

    const currentServerIndex = props.orderedServers.findIndex(
      (server) => server.id === serverId
    );

    const nextIndex = currentServerIndex + byOffset;

    if (nextIndex === -1) {
      return navigate('/app');
    }

    // this will wrap the index around
    const nextServer = props.orderedServers.at(
      nextIndex % props.orderedServers.length
    );

    if (nextServer) {
      navigate(`/server/${nextServer.id}`);
    }
  };

  const navigateServerUp = (ev: KeyboardEvent) => navigateServer(ev, -1);
  const navigateServerDown = (ev: KeyboardEvent) => navigateServer(ev, 1);

  onMount(() => {
    keybinds.addEventListener(KeybindAction.NavigateServerUp, navigateServerUp);
    keybinds.addEventListener(
      KeybindAction.NavigateServerDown,
      navigateServerDown
    );
  });

  onCleanup(() => {
    keybinds.removeEventListener(
      KeybindAction.NavigateServerUp,
      navigateServerUp
    );
    keybinds.removeEventListener(
      KeybindAction.NavigateServerDown,
      navigateServerDown
    );
  });

  return (
    <ServerListBase>
      <div use:invisibleScrollable={{ direction: 'y', class: listBase() }}>
        <EntryContainer>
          {/* <Show when={!props.selectedServer()}>
            <PositionSwoosh>
              <Swoosh topItem />
            </PositionSwoosh>
          </Show> */}
          <a href='/app'>
            <Avatar size={42} fallback={<MdHome />} />
          </a>
        </EntryContainer>
        <Tooltip
          placement='right'
          content={() => (
            <Column gap='none'>
              <span>{props.user.username}</span>
              <Typography variant='small'>{props.user.presence}</Typography>
            </Column>
          )}
          aria={props.user.username}
        >
          <EntryContainer>
            {/* TODO: Make this open user status context menu */}
            <a href='/app'>
              <Avatar
                size={42}
                src={props.user.avatarURL}
                holepunch={'bottom-right'}
                overlay={<UserStatusGraphic status={props.user.presence} />}
                interactive
              />
            </a>
          </EntryContainer>
        </Tooltip>
        <For each={props.unreadConversations.slice(0, 9)}>
          {(conversation) => (
            <Tooltip placement='right' content={conversation.displayName}>
              <EntryContainer use:floating={props.menuGenerator(conversation)}>
                <a href={`/channel/${conversation.id}`}>
                  <Avatar
                    size={42}
                    // TODO: fix this
                    src={conversation.iconURL}
                    holepunch={conversation.unread ? 'top-right' : 'none'}
                    overlay={
                      <>
                        <Show when={conversation.unread}>
                          <UnreadsGraphic
                            count={conversation.mentions?.size ?? 0}
                            unread
                          />
                        </Show>
                      </>
                    }
                    fallback={
                      conversation.name ?? conversation.recipient?.username
                    }
                    interactive
                  />
                </a>
              </EntryContainer>
            </Tooltip>
          )}
        </For>
        <Show when={props.unreadConversations.length > 9}>
          <EntryContainer>
            <a href={`/`}>
              <Avatar
                size={42}
                fallback={<>+{props.unreadConversations.length - 9}</>}
              />
            </a>
          </EntryContainer>
        </Show>
        <LineDivider />
        <Draggable items={props.orderedServers} onChange={props.setServerOrder}>
          {(item) => (
            <Show
              when={
                item.$exists /** reactivity lags behind here for some reason,
                                 just check existence before continuing */
              }
            >
              <Tooltip placement='right' content={item.name}>
                <EntryContainer use:floating={props.menuGenerator(item)}>
                  <Show when={props.selectedServer() === item.id}>
                    <PositionSwoosh>
                      <Swoosh />
                    </PositionSwoosh>
                  </Show>
                  <a href={`/server/${item.id}`}>
                    <Avatar
                      size={42}
                      src={item.iconURL}
                      holepunch={item.unread ? 'top-right' : 'none'}
                      overlay={
                        <>
                          <Show when={item.unread}>
                            <UnreadsGraphic
                              count={item.mentions.length}
                              unread
                            />
                          </Show>
                        </>
                      }
                      fallback={item.name}
                      interactive
                    />
                  </a>
                </EntryContainer>
              </Tooltip>
            </Show>
          )}
        </Draggable>
        <Tooltip placement='right' content={'Create or join a server'}>
          <EntryContainer>
            <a onClick={() => props.onCreateOrJoinServer()}>
              <Avatar size={42} fallback={<MdAdd />} />
            </a>
          </EntryContainer>
        </Tooltip>
        <Tooltip placement='right' content={'Find new servers to join'}>
          <EntryContainer>
            <Avatar size={42} fallback={<MdExplore />} />
          </EntryContainer>
        </Tooltip>
      </div>
      <Shadow>
        <div />
      </Shadow>
      <Tooltip placement='right' content='Settings'>
        <EntryContainer>
          <a href='/settings'>
            <Avatar size={42} fallback={<MdSettings />} interactive />
          </a>
        </EntryContainer>
      </Tooltip>
    </ServerListBase>
  );
};

/**
 * Server list container
 */
const ServerListBase = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--colours-background)',
  },
});

/**
 * Container around list of servers
 */
const listBase = cva({
  base: {
    flexGrow: 1,
  },
});

/**
 * Server entries
 */
const EntryContainer = styledLegacy('div', 'Entry')`
  width: 56px;
  height: 56px;
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;

  a {
    z-index: 1;
  }
`;

/**
 * Divider line between two lists
 */
const LineDivider = styledLegacy.div`
  height: 1px;
  flex-shrink: 0;
  margin: 6px auto;
  width: calc(100% - 24px);
  background: ${({ theme }) =>
    theme!.colours['sidebar-server-list-foreground']};
`;

/**
 * Position the Swoosh correctly
 */
const PositionSwoosh = styledLegacy.div`
  user-select: none;
  position: absolute;
  pointer-events: none;
`;

/**
 * Shadow at the bottom of the list
 */
const Shadow = styledLegacy('div', 'Shadow')`
  height: 0;
  z-index: 1;
  display: relative;

  div {
    height: 12px;
    margin-top: -12px;
    display: absolute;
    background: linear-gradient(
      to bottom,
      transparent,
      ${(props) => props.theme!.colours['background']}
    );
  }
`;
