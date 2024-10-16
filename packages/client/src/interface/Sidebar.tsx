import { ChannelContextMenu, ServerSidebarContextMenu } from '@revolt/app';
import { useClient, useUser } from '@revolt/client';
import { modalController } from '@revolt/modal';
import { Route, useParams, useSmartParams } from '@revolt/routing';
import { state } from '@revolt/state';
import { HomeSidebar, ServerList, ServerSidebar } from '@revolt/ui';
import type { Server as ServerI } from 'revolt.js';
import { Channel } from 'revolt.js';
import type { Component } from 'solid-js';
import type { JSX } from 'solid-js';
import { createMemo, Match, Show, Switch } from 'solid-js';

/**
 * Left-most channel navigation sidebar
 */
export const Sidebar = (props: {
  /**
   * Menu generator TODO FIXME: remove
   */
  menuGenerator: (t: ServerI | Channel) => JSX.Directives['floating'];
}) => {
  const user = useUser();
  const client = useClient();
  const params = useParams<{ server: string }>();

  return (
    <div style={{ display: 'flex', 'flex-shrink': 0 }}>
      <ServerList
        orderedServers={state.ordering.orderedServers}
        setServerOrder={state.ordering.setServerOrder}
        unreadConversations={state.ordering.orderedConversations.filter(
          // TODO: muting channels
          (channel) => channel.unread
        )}
        user={user()!}
        selectedServer={() => params.server}
        onCreateOrJoinServer={() =>
          modalController.push({
            type: 'create_or_join_server',
            client: client(),
          })
        }
        menuGenerator={props.menuGenerator}
      />
      <Switch fallback={<Home />}>
        <Match when={params.server}>
          <Server />
        </Match>
      </Switch>
    </div>
  );
};

/**
 * Render sidebar for home
 */
const Home: Component = () => {
  const params = useSmartParams();
  const client = useClient();
  const conversations = createMemo(() => state.ordering.orderedConversations);

  return (
    <HomeSidebar
      conversations={conversations}
      channelId={params().channelId}
      openSavedNotes={(navigate) => {
        // Check whether the saved messages channel exists already
        const channelId = [...client()!.channels.values()].find(
          (channel) => channel.type === 'SavedMessages'
        )?.id;

        if (navigate) {
          if (channelId) {
            // Navigate if exists
            navigate(`/channel/${channelId}`);
          } else {
            // If not, try to create one but only if navigating
            client()!
              .user!.openDM()
              .then((channel) => navigate(`/channel/${channel.id}`));
          }
        }

        // Otherwise return channel ID if available
        return channelId;
      }}
      __tempDisplayFriends={() => state.experiments.isEnabled('friends')}
    />
  );
};

/**
 * Render sidebar for a server
 */
const Server: Component = () => {
  const params = useSmartParams();
  const client = useClient();

  /**
   * Resolve the server
   * @returns Server
   */
  const server = () => client()!.servers.get(params().serverId!)!;

  /**
   * Open the server information modal
   */
  function openServerInfo() {
    modalController.push({
      type: 'server_info',
      server: server(),
    });
  }

  /**
   * Open the server settings modal
   */
  function openServerSettings() {
    modalController.push({
      type: 'settings',
      config: 'server',
      context: server(),
    });
  }

  return (
    <Show when={server()}>
      <ServerSidebar
        server={server()}
        channelId={params().channelId}
        openServerInfo={openServerInfo}
        openServerSettings={openServerSettings}
        menuGenerator={(target) => ({
          contextMenu: () =>
            target instanceof Channel ? (
              <ChannelContextMenu channel={target} />
            ) : (
              <ServerSidebarContextMenu server={target} />
            ),
        })}
      />
    </Show>
  );
};
