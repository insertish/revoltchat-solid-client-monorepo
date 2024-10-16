import { useClient } from '@revolt/client';
import { Navigate, useParams } from '@revolt/routing';
import type { Component } from 'solid-js';
import { createMemo, Match, Switch } from 'solid-js';

/**
 * Server home component
 */
export const ServerHome: Component = () => {
  const params = useParams();
  const client = useClient();
  const server = createMemo(() => client()!.servers.get(params.server)!);

  return (
    // TODO: port the nice fallback
    <Switch fallback='No channels!'>
      <Match when={!server()}>
        <Navigate href={'/'} />
      </Match>
      <Match when={server().defaultChannel}>
        <Navigate href={`channel/${server().defaultChannel!.id}`} />
      </Match>
    </Switch>
  );
};
