import emojiRegex from 'emoji-regex';

import { UnicodeEmoji } from '../emoji';
import type { CustomComponentProps } from './remarkRegexComponent';
import { createRegexComponent } from './remarkRegexComponent';

/**
 * Render Unicode emoji
 */
export function RenderUnicodeEmoji(props: CustomComponentProps) {
  return <UnicodeEmoji emoji={props.str} />;
}

export const remarkUnicodeEmoji = createRegexComponent('uemoji', emojiRegex());
