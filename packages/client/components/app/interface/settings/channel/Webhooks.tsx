import { useClient } from '@revolt/client';
import {
  Avatar,
  CategoryButton,
  Column,
  Preloader,
  Typography,
} from '@revolt/ui';
import type { ChannelWebhook } from 'revolt.js';
import { BiSolidCloud, BiSolidTrash } from 'solid-icons/bi';
import { createSignal, For, Match, onMount, Show, Switch } from 'solid-js';

import { useSettingsNavigation } from '../Settings';
import type { ChannelSettingsProps } from '.';

/**
 * Webhooks
 */
export default function Webhooks(props: ChannelSettingsProps) {
  const client = useClient();
  const { navigate } = useSettingsNavigation();
  const [webhooks, setWebhooks] = createSignal<ChannelWebhook[]>();

  onMount(() => {
    const existingWebhooks = client().channelWebhooks.filter(
      (webhook) => webhook.channelId === props.channel.id
    );

    if (existingWebhooks.length) {
      setWebhooks(client().channelWebhooks.toList());
    } else {
      props.channel.fetchWebhooks().then(setWebhooks);
    }
  });

  return (
    <Column gap='xl'>
      <CategoryButton
        action='chevron'
        icon={<BiSolidCloud size={24} />}
        onClick={() => void 0}
      >
        Create Webhook
      </CategoryButton>

      <Show when={!webhooks() || webhooks()!.length !== 0}>
        <Column>
          <Typography variant='label'>My Bots</Typography>
          <Switch fallback={<Preloader type='ring' />}>
            <Match when={webhooks()?.length}>
              <For each={webhooks()}>
                {(webhook) => (
                  <CategoryButton
                    icon={<Avatar src={webhook.avatarURL} size={24} />}
                    description={webhook.id}
                    onClick={() => navigate(`webhooks/${webhook.id}`)}
                    action='chevron'
                  >
                    {webhook.name}
                  </CategoryButton>
                )}
              </For>
            </Match>
          </Switch>
        </Column>
      </Show>
    </Column>
  );
}

/**
 * Webhook
 */
export function Webhook(props: { webhook: ChannelWebhook }) {
  return (
    <Column gap='xl'>
      <CategoryButton
        action='chevron'
        icon={<BiSolidTrash size={24} />}
        onClick={() => void 0}
      >
        Delete
      </CategoryButton>
    </Column>
  );
}
