import type { JSX } from 'solid-js';

import { CustomEmoji, RE_ANY_EMOJI, UnicodeEmoji } from '.';

/**
 * Convert any arbitrary text to rich text with emoji
 */
export function TextWithEmoji(props: { content?: string }) {
  /**
   * Render the actual content
   * @param content Content
   * @returns Elements
   */
  function render(content?: string) {
    if (!content) return null;

    const components: JSX.Element[] = [];

    let lastIndex = 0;

    /**
     * Push content up to given index
     * @param index Index
     */
    function pushToIndex(index: number) {
      if (lastIndex === index) return;
      components.push(<>{content!.slice(lastIndex, index)}</>);
    }

    RE_ANY_EMOJI.lastIndex = 0;
    let match = RE_ANY_EMOJI.exec(content);
    while (match) {
      pushToIndex(match.index);
      lastIndex = match.index + match[0].length;

      components.push(
        match[0].length === 28 ? (
          <CustomEmoji id={match[1]} />
        ) : (
          <UnicodeEmoji emoji={match[0]} />
        )
      );

      match = RE_ANY_EMOJI.exec(content);
    }

    pushToIndex(content.length);

    return components;
  }

  return <>{render(props.content)}</>;
}
