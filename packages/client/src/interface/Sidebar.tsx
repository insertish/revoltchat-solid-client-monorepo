import { Component, Show, createMemo } from "solid-js";

import { useClient, useUser } from "@revolt/client";
import { modalController } from "@revolt/modal";
import { Route, Routes, useSmartParams } from "@revolt/routing";
import { state } from "@revolt/state";
import { HomeSidebar, ServerList, ServerSidebar } from "@revolt/ui";

/**
 * Left-most channel navigation sidebar
 */
export const Sidebar: Component = () => {
  const user = useUser();
  const client = useClient();

  return (
    <div style={{ display: "flex", "flex-shrink": 0 }}>
      <ServerList
        orderedServers={state.ordering.orderedServers}
        setServerOrder={state.ordering.setServerOrder}
        unreadConversations={state.ordering.orderedConversations.filter(
          // TODO: muting channels
          (channel) => channel.unread
        )}
        user={user()!}
        selectedServer={() => "01F7ZSBSFHQ8TA81725KQCSDDP"}
        onCreateOrJoinServer={() =>
          modalController.push({
            type: "create_or_join_server",
            client: client(),
          })
        }
      />
      <Server />
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
          (channel) => channel.type === "SavedMessages"
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
      __tempDisplayFriends={() => state.experiments.isEnabled("friends")}
    />
  );
};

/**
 * Render sidebar for a server
 */
const Server: Component = () => {
  const client = useClient();

  /**
   * Resolve the server
   * @returns Server
   */
  const server = () => client()!.servers.get("01F7ZSBSFHQ8TA81725KQCSDDP")!;

  /**
   * Open the server information modal
   */
  function openServerInfo() {
    modalController.push({
      type: "server_info",
      server: server(),
    });
  }

  /**
   * Open the server settings modal
   */
  function openServerSettings() {
    modalController.push({
      type: "settings",
      config: "server",
      context: server(),
    });
  }

  return (
    <Show when={server()}>
      <ServerSidebar
        server={server()}
        channelId={"01F92C5ZXBQWQ8KY7J8KY917NM"}
        openServerInfo={openServerInfo}
        openServerSettings={openServerSettings}
      />
    </Show>
  );
};
