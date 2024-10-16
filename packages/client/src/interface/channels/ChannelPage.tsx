import { useClient } from '@revolt/client';
import { TextWithEmoji } from '@revolt/markdown';
import { Navigate, useParams } from '@revolt/routing';
import { Header, styled, Typography } from '@revolt/ui';
import type { Channel } from 'revolt.js';
import type { Component } from 'solid-js';
import { createMemo, Match, Switch } from 'solid-js';

import { TextChannel } from './text/TextChannel';

/**
 * Channel layout
 */
const Base = styled('div')`
  min-width: 0;
  flex-grow: 1;
  display: flex;
  position: relative;
  flex-direction: column;
`;

export interface ChannelPageProps {
  channel: Channel;
}

const TEXT_CHANNEL_TYPES: Channel['type'][] = [
  'TextChannel',
  'DirectMessage',
  'Group',
  'SavedMessages',
];

/**
 * Channel component
 */
export const ChannelPage: Component = () => {
  const params = useParams();
  const client = useClient();
  const channel = createMemo(() => client()!.channels.get(params.channel)!);

  return (
    <Base>
      <Switch fallback='Unknown channel type!'>
        <Match when={!channel()}>
          <Navigate href={'../..'} />
        </Match>
        <Match when={TEXT_CHANNEL_TYPES.includes(channel()!.type)}>
          <TextChannel channel={channel()} />
        </Match>
        <Match when={channel()!.type === 'VoiceChannel'}>
          <Header placement='primary'>
            <TextWithEmoji content={channel().name!} />
          </Header>
          <Typography variant='legacy-modal-title'>
            Legacy voice channels are not supported!
          </Typography>
        </Match>
      </Switch>
    </Base>
  );
};
