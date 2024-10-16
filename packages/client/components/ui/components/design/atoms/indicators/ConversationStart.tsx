import { useTranslation } from '@revolt/i18n';
import type { Channel } from 'revolt.js';
import { Show } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Typography } from '../display';

interface Props {
  /**
   * Channel information
   */
  channel: Channel;
}

/**
 * Mark the beginning of a conversation
 */
export function ConversationStart(props: Props) {
  const t = useTranslation();

  return (
    <Base>
      <Show when={props.channel.type !== 'SavedMessages'}>
        <Typography variant='conversation-channel-name'>
          {props.channel.name ?? props.channel.recipient?.username}
        </Typography>
      </Show>
      <Typography variant='conversation-start'>
        {t(
          `app.main.channel.start.${
            props.channel.type === 'SavedMessages' ? 'saved' : 'group'
          }`
        )}
      </Typography>
    </Base>
  );
}

/**
 * Base styles
 */
const Base = styled.div`
  margin: 18px 16px 10px 16px;
`;
