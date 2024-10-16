import MdPersonAdd from '@material-design-icons/svg/filled/person_add.svg?component-solid';
import MdSettings from '@material-design-icons/svg/filled/settings.svg?component-solid';
import { getController } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import { KeybindAction } from '@revolt/keybinds/actions';
import { TextWithEmoji } from '@revolt/markdown';
import { useNavigate } from '@revolt/routing';
import type { API, Channel, Server, ServerFlags } from 'revolt.js';
import {
  BiRegularCheckCircle,
  BiRegularHash,
  BiRegularPhoneCall,
  BiSolidCheckCircle,
  BiSolidChevronRight,
  BiSolidCog,
} from 'solid-icons/bi';
import type { JSX } from 'solid-js';
import {
  createMemo,
  createSignal,
  For,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import { styled } from 'solid-styled-components';

import { iconSize } from '../../..';
import { useKeybindActions } from '../../context/Keybinds';
import { Header, HeaderWithImage } from '../../design/atoms/display/Header';
import { Typography } from '../../design/atoms/display/Typography';
import { MenuButton } from '../../design/atoms/inputs/MenuButton';
import { Column, OverflowingText, Row } from '../../design/layout';
import { Tooltip } from '../../floating';
import { SidebarBase } from './common';

interface Props {
  /**
   * Server to display sidebar for
   */
  server: Server;

  /**
   * Currently selected channel ID
   */
  channelId: string | undefined;

  /**
   * Open server information modal
   */
  openServerInfo: () => void;

  /**
   * Open server settings modal
   */
  openServerSettings: () => void;

  /**
   * Menu generator
   */
  menuGenerator: (target: Server | Channel) => JSX.Directives['floating'];
}

/**
 * Ordered category data returned from server
 */
type CategoryData = Omit<API.Category, 'channels'> & { channels: Channel[] };

/**
 * Display server information and channels
 */
export const ServerSidebar = (props: Props) => {
  const navigate = useNavigate();
  const keybinds = useKeybindActions();

  // TODO: this does not filter visible channels at the moment because the state for categories is not stored anywhere
  /** Gets a list of channels that are currently not hidden inside a closed category */
  const visibleChannels = () =>
    props.server.orderedChannels.flatMap((category) => category.channels);

  // TODO: when navigating channels, we want to add aria-keyshortcuts={localized-shortcut} to the next/previous channels
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts
  // TODO: issue warning if nothing is found somehow? warnings can be nicer than flat out not working
  // TODO: we want it to feel smooth when navigating through channels, so we'll want to select channels immediately but not actually navigate until we're done moving through them
  /** Navigates to the channel offset from the current one, wrapping around if needed */
  const navigateChannel = (byOffset: number) => {
    if (props.channelId == null) {
      return;
    }

    const channels = visibleChannels();

    const currentChannelIndex = channels.findIndex(
      (channel) => channel.id === props.channelId
    );

    // this will wrap the index around
    const nextChannel = channels.at(
      (currentChannelIndex + byOffset) % channels.length
    );

    if (nextChannel) {
      navigate(`/server/${props.server.id}/channel/${nextChannel.id}`);
    }
  };

  const navigateChannelUp = () => navigateChannel(-1);
  const navigateChannelDown = () => navigateChannel(1);

  onMount(() => {
    keybinds.addEventListener(
      KeybindAction.NavigateChannelUp,
      navigateChannelUp
    );
    keybinds.addEventListener(
      KeybindAction.NavigateChannelDown,
      navigateChannelDown
    );
  });

  onCleanup(() => {
    keybinds.removeEventListener(
      KeybindAction.NavigateChannelUp,
      navigateChannelUp
    );
    keybinds.removeEventListener(
      KeybindAction.NavigateChannelDown,
      navigateChannelDown
    );
  });

  return (
    <SidebarBase>
      <Switch
        fallback={
          <Header placement='secondary'>
            <ServerInfo
              server={props.server}
              openServerInfo={props.openServerInfo}
              openServerSettings={props.openServerSettings}
            />
          </Header>
        }
      >
        <Match when={props.server.banner}>
          <HeaderWithImage
            placement='secondary'
            style={{
              background: `url('${props.server.bannerURL}')`,
            }}
          >
            <ServerInfo
              server={props.server}
              openServerInfo={props.openServerInfo}
              openServerSettings={props.openServerSettings}
            />
          </HeaderWithImage>
        </Match>
      </Switch>
      <div
        use:scrollable={{ showOnHover: true }}
        style={{ 'flex-grow': 1 }}
        use:floating={props.menuGenerator(props.server)}
      >
        <List gap='lg'>
          <div />
          <For each={props.server.orderedChannels}>
            {(category) => (
              <Category
                category={category}
                channelId={props.channelId}
                menuGenerator={props.menuGenerator}
              />
            )}
          </For>
          <div />
        </List>
      </div>
    </SidebarBase>
  );
};

/**
 * Server Information
 */
function ServerInfo(
  props: Pick<Props, 'server' | 'openServerInfo' | 'openServerSettings'>
) {
  return (
    <Row align grow>
      <ServerBadge flags={props.server.flags} />
      <ServerName onClick={props.openServerInfo}>
        <OverflowingText>
          <TextWithEmoji content={props.server.name} />
        </OverflowingText>
      </ServerName>
      <SettingsLink onClick={props.openServerSettings}>
        <BiSolidCog size={18} />
      </SettingsLink>
    </Row>
  );
}

/**
 * Server name
 */
const ServerName = styled.a`
  flex-grow: 1;
`;

/**
 * Settings link
 */
const SettingsLink = styled.a`
  cursor: pointer;

  > * {
    display: block;
  }
`;

/**
 * Server badge
 */
function ServerBadge(props: { flags: ServerFlags }) {
  const t = useTranslation();

  return (
    <Show when={props.flags}>
      <Tooltip
        content={
          props.flags === 1
            ? t('app.special.server-badges.official')
            : t('app.special.server-badges.verified')
        }
        placement='top'
      >
        {props.flags === 1 ? (
          <BiSolidCheckCircle size={12} />
        ) : (
          <BiRegularCheckCircle size={12} />
        )}
      </Tooltip>
    </Show>
  );
}

/**
 * Single category entry
 */
function Category(
  props: {
    category: CategoryData;
    channelId: string | undefined;
  } & Pick<Props, 'menuGenerator'>
) {
  const [shown, setShown] = createSignal(true);
  const channels = createMemo(() =>
    props.category.channels.filter(
      (channel) =>
        props.category.id === 'default' ||
        shown() ||
        channel.unread ||
        channel.id === props.channelId
    )
  );

  return (
    <Column gap='sm'>
      <Show when={props.category.id !== 'default'}>
        <CategoryBase
          open={shown()}
          onClick={() => setShown((shown) => !shown)}
          align
          gap='sm'
        >
          <BiSolidChevronRight size={12} />
          <Typography variant='category'>{props.category.title}</Typography>
        </CategoryBase>
      </Show>
      <For each={channels()}>
        {(channel) => (
          <Entry
            channel={channel}
            active={channel.id === props.channelId}
            menuGenerator={props.menuGenerator}
          />
        )}
      </For>
    </Column>
  );
}

/**
 * Category title styling
 */
const CategoryBase = styled(Row)<{ open: boolean }>`
  padding: 0 4px;
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;
  transition: ${(props) => props.theme!.transitions.fast} all;

  color: ${(props) =>
    props.theme!.colours['sidebar-channels-category-foreground']};

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    filter: brightness(1.2);
  }

  svg {
    transition: ${(props) => props.theme!.transitions.fast} transform;
    transform: rotateZ(${(props) => (props.open ? 90 : 0)}deg);
  }
`;

/**
 * Server channel entry
 */
function Entry(
  props: { channel: Channel; active: boolean } & Pick<Props, 'menuGenerator'>
) {
  return (
    <a href={`/server/${props.channel.serverId}/channel/${props.channel.id}`}>
      <MenuButton
        use:floating={props.menuGenerator(props.channel)}
        size='thin'
        alert={
          !props.active &&
          props.channel.unread &&
          (props.channel.mentions?.size || true)
        }
        attention={
          props.active ? 'selected' : props.channel.unread ? 'active' : 'normal'
        }
        icon={
          <>
            <Switch fallback={<BiRegularHash size={20} />}>
              <Match when={props.channel.type === 'VoiceChannel'}>
                <BiRegularPhoneCall size={20} />
              </Match>
            </Switch>
            <Show when={props.channel.icon}>
              <ChannelIcon src={props.channel.smallIconURL} />
            </Show>
          </>
        }
        actions={
          <>
            <a
              use:floating={{
                tooltip: {
                  placement: 'top',
                  content: 'Create Invite',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                getController('modal').push({
                  type: 'create_invite',
                  channel: props.channel,
                });
              }}
            >
              <MdPersonAdd {...iconSize('14px')} />
            </a>

            <a
              use:floating={{
                tooltip: {
                  placement: 'top',
                  content: 'Edit Channel',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                getController('modal').push({
                  type: 'settings',
                  config: 'channel',
                  context: props.channel,
                });
              }}
            >
              <MdSettings {...iconSize('14px')} />
            </a>
          </>
        }
      >
        <OverflowingText>
          <TextWithEmoji content={props.channel.name!} />
        </OverflowingText>
      </MenuButton>
    </a>
  );
}

/**
 * Channel icon styling
 */
const ChannelIcon = styled('img')`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

/**
 * Inner scrollable list
 * We fix the width in order to prevent scrollbar from moving stuff around
 */
const List = styled(Column)`
  width: ${(props) => props.theme!.layout.width['channel-sidebar']};
`;
