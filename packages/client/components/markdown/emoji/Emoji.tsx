import { Match, Switch } from 'solid-js';
import { styled } from 'solid-styled-components';

import { CustomEmoji, UnicodeEmoji } from '.';

/**
 * Image component for rendering emojis
 */
export const EmojiBase = styled('img', 'Emoji')`
  object-fit: contain;

  display: inline;
  width: var(--emoji-size);
  height: var(--emoji-size);
  margin: 0 0.05em 0 0.1em;
  vertical-align: -0.3em;

  img:before {
    content: ' ';
    display: block;
    position: absolute;
    height: 50px;
    width: 50px;
    background-image: url(ishere.jpg);
  }
`;

/**
 * Render an individual emoji
 */
export function Emoji(props: { emoji: string }) {
  return (
    <Switch fallback={<UnicodeEmoji emoji={props.emoji} />}>
      <Match when={props.emoji.length === 26}>
        <CustomEmoji id={props.emoji} />
      </Match>
    </Switch>
  );
}
