import { ChannelContextMenu, ServerContextMenu } from '@revolt/app';
import { clientController } from '@revolt/client';
import { State, TransitionType } from '@revolt/client/Controller';
import { KeybindAction } from '@revolt/keybinds';
import { modalController } from '@revolt/modal';
import { Navigate, useBeforeLeave } from '@revolt/routing';
import { state } from '@revolt/state';
import { Button, Preloader, styled } from '@revolt/ui';
import { useKeybindActions } from '@revolt/ui/components/context/Keybinds';
import { Server } from 'revolt.js';
import type { JSX } from 'solid-js';
import { Component, Match, onCleanup, onMount, Switch } from 'solid-js';

import { Sidebar } from './interface/Sidebar';

/**
 * Application layout
 */
const Interface = (props: { children: JSX.Element }) => {
  const keybinds = useKeybindActions();

  useBeforeLeave((e) => {
    if (!e.defaultPrevented) {
      if (e.to === '/settings') {
        e.preventDefault();
        modalController.push({
          type: 'settings',
          config: 'user',
        });
      } else if (typeof e.to === 'string') {
        state.layout.setLastActivePath(e.to);
      }
    }
  });

  onMount(() => {
    keybinds.addEventListener(
      KeybindAction.DeveloperToggleAllExperiments,
      state.experiments.toggleSafeMode
    );
  });

  onCleanup(() => {
    keybinds.removeEventListener(
      KeybindAction.DeveloperToggleAllExperiments,
      state.experiments.toggleSafeMode
    );
  });

  return (
    <Switch fallback={<Preloader grow type='spinner' />}>
      <Match when={!clientController.isLoggedIn()}>
        <Navigate href='/login' />
      </Match>
      <Match when={clientController.lifecycle.loadedOnce()}>
        <div
          style={{
            display: 'flex',
            'flex-direction': 'column',
            height: '100%',
          }}
        >
          <Notice>
            ⚠️ This is beta software, things will break! State:{' '}
            <Switch>
              <Match
                when={clientController.lifecycle.state() === State.Connecting}
              >
                Connecting
              </Match>
              <Match
                when={clientController.lifecycle.state() === State.Connected}
              >
                Connected
              </Match>
              <Match
                when={clientController.lifecycle.state() === State.Disconnected}
              >
                Disconnected{' '}
                <a
                  onClick={() =>
                    clientController.lifecycle.transition({
                      type: TransitionType.Retry,
                    })
                  }
                >
                  (reconnect now)
                </a>
              </Match>
              <Match
                when={clientController.lifecycle.state() === State.Reconnecting}
              >
                Reconnecting
              </Match>
              <Match
                when={clientController.lifecycle.state() === State.Offline}
              >
                Device is offline
              </Match>
            </Switch>
          </Notice>
          <Layout
            style={{ 'flex-grow': 1, 'min-height': 0 }}
            onDragOver={(e) => {
              if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
            }}
            onDrop={(e) => e.preventDefault()}
          >
            <Sidebar
              menuGenerator={(target) => ({
                contextMenu: () => {
                  return (
                    <>
                      {target instanceof Server ? (
                        <ServerContextMenu server={target} />
                      ) : (
                        <ChannelContextMenu channel={target} />
                      )}
                    </>
                  );
                },
              })}
            />
            {props.children}
          </Layout>
        </div>
      </Match>
    </Switch>
  );
};

const Notice = styled.div`
  text-align: center;
  font-size: 0.8em;
  margin: ${(props) => props.theme!.gap.md} ${(props) => props.theme!.gap.md} 0
    ${(props) => props.theme!.gap.md};
  padding: ${(props) => props.theme!.gap.md};
  background: ${(props) =>
    props.theme!.colours['messaging-message-box-background']};
  color: ${(props) => props.theme!.colours['messaging-message-box-foreground']};
  border-radius: ${(props) => props.theme!.borderRadius.md};
`;

/**
 * Parent container
 */
const Layout = styled('div', 'Layout')`
  display: flex;
  height: 100%;
`;

export default Interface;
