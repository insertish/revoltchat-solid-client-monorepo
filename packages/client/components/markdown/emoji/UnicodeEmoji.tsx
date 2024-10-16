import type { ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { EmojiBase, toCodepoint } from '.';

/**
 * Display Unicode emoji
 */
export function UnicodeEmoji(
  props: { emoji: string } & Omit<
    ComponentProps<typeof EmojiBase>,
    'loading' | 'class' | 'alt' | 'draggable' | 'src'
  >
) {
  const [local, remote] = splitProps(props, ['emoji']);

  return (
    <EmojiBase
      {...remote}
      loading='lazy'
      class='emoji'
      alt={local.emoji}
      draggable={false}
      src={`https://static.revolt.chat/emoji/fluent-3d/${toCodepoint(
        local.emoji
      )}.svg?v=1`}
    />
  );
}
