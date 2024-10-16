import { useTranslation } from '@revolt/i18n';
import type { Message } from 'revolt.js';
import { BiRegularAt, BiSolidXCircle } from 'solid-icons/bi';
import { Show } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Row } from '../../design';
import { MessageReply } from '../message/MessageReply';

interface Props {
  /**
   * Message to display
   */
  message?: Message;

  /**
   * Whether we are mentioning this message
   */
  mention: boolean;

  /**
   * Whether this is our own message and we should hide mention option
   */
  self: boolean;

  /**
   * Toggle the mention
   */
  toggle: () => void;

  /**
   * Dismiss the mention
   */
  dismiss: () => void;
}

/**
 * Left side "replying to" text
 */
const ReplyTo = styled.span`
  flex-shrink: 0;
`;

/**
 * Mention toggle
 */
const MentionToggle = styled.a<{ mention: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  flex-direction: row;
  text-transform: uppercase;
  gap: ${(props) => props.theme!.gap.sm};

  color: ${(props) =>
    props.theme!.colours[
      `messaging-indicator-reply-${props.mention ? 'enabled' : 'disabled'}`
    ]};
`;

/**
 * Dismiss reply button
 */
const Dismiss = styled.a`
  display: grid;
  place-items: center;
`;

/**
 * Preview container
 */
const Base = styled(Row)`
  font-size: 0.8em;
  user-select: none;

  padding: ${(props) => props.theme!.gap.md} ${(props) => props.theme!.gap.lg};
  border-radius: ${(props) => props.theme!.borderRadius.lg};

  color: ${(props) => props.theme!.colours['messaging-indicator-foreground']};
  background: ${(props) =>
    props.theme!.colours['messaging-indicator-background']};

  a:hover {
    filter: brightness(1.2);
  }
`;

/**
 * Preview of message reply
 */
export function MessageReplyPreview(props: Props) {
  const t = useTranslation();

  return (
    <Base gap='md' align>
      <ReplyTo>{t('app.main.channel.reply.replying')}</ReplyTo>
      <MessageReply message={props.message} noDecorations />
      <Row gap='lg' align>
        <Show when={!props.self}>
          <MentionToggle mention={props.mention} onClick={props.toggle}>
            <BiRegularAt size={16} />
            {props.mention ? t('general.on') : t('general.off')}
          </MentionToggle>
        </Show>
        <Dismiss onClick={props.dismiss}>
          <BiSolidXCircle size={16} />
        </Dismiss>
      </Row>
    </Base>
  );
}
