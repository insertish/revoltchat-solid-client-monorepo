import { useClient } from '@revolt/client';
import type { ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { EmojiBase } from '.';

/**
 * Display custom emoji
 */
export function CustomEmoji(
  props: { id: string } & Omit<
    ComponentProps<typeof EmojiBase>,
    'loading' | 'class' | 'draggable' | 'src'
  >
) {
  const [local, remote] = splitProps(props, ['id']);
  const client = useClient();

  /**
   * Resolve emoji URL
   */
  const url = () =>
    `${client()?.configuration?.features.autumn.url}/emojis/${local.id}`;

  return (
    <EmojiBase
      {...remote}
      loading='lazy'
      class='emoji'
      draggable={false}
      src={url()}
      alt={`:${local.id}:`}
    />
  );
}
