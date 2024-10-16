import { useClient } from '@revolt/client';
import { Avatar, Column, Row, styled } from '@revolt/ui';
import { createSignal, Match, onMount, Switch } from 'solid-js';

import { CustomEmoji, Emoji, RE_CUSTOM_EMOJI } from '../emoji';
import type { CustomComponentProps } from './remarkRegexComponent';
import { createRegexComponent } from './remarkRegexComponent';

/**
 * Render a custom emoji
 *
 * This will also display a tooltip and fallback to text if the emoji doesn't exist.
 */
export function RenderCustomEmoji(props: CustomComponentProps) {
  const [exists, setExists] = createSignal(true);

  const client = useClient();

  /**
   * Resolve emoji
   */
  const emoji = () => client()!.emojis.get(props.match);

  /**
   * Resolve server
   */
  const server = () =>
    client()!.servers.get(
      (emoji()!.parent as { type: 'Server'; id: string }).id
    )!;

  return (
    <Switch fallback={<span>{`:${emoji()?.name ?? props.match}:`}</span>}>
      <Match when={exists()}>
        <TooltipTrigger
          use:floating={{
            tooltip: {
              placement: 'top',
              content: () => (
                <Row align gap='lg'>
                  <span style={{ '--emoji-size': '3em' }}>
                    <Emoji emoji={props.match} />
                  </span>
                  <Switch
                    fallback={
                      <>
                        Unknown emote
                        <FetchEmote id={props.match} />
                      </>
                    }
                  >
                    <Match when={emoji()?.parent.type === 'Server'}>
                      <Column align>
                        <span>{`:${emoji()!.name}:`}</span>
                        <Switch fallback='Private Server'>
                          <Match when={server()}>
                            <Row align>
                              <Avatar
                                size={14}
                                src={server().animatedIconURL}
                              />
                              {server().name}
                            </Row>
                          </Match>
                        </Switch>
                      </Column>
                    </Match>
                  </Switch>
                </Row>
              ),
              aria:
                emoji()?.parent.type === 'Server'
                  ? `:${emoji()!.name}: from ${
                      server()?.name ?? 'Private Server'
                    }`
                  : 'Unknown emote',
            },
          }}
        >
          <CustomEmoji id={props.match} onError={() => setExists(false)} />
        </TooltipTrigger>
      </Match>
    </Switch>
  );
}

/**
 * Container for trigger
 */
const TooltipTrigger = styled.div`
  display: inline-block;
`;

/**
 * Helper to fetch unknown emotes
 */
function FetchEmote(props: { id: string }) {
  const client = useClient();
  onMount(() => client().emojis.fetch(props.id));
  return null;
}

export const remarkCustomEmoji = createRegexComponent(
  'cemoji',
  RE_CUSTOM_EMOJI
);
