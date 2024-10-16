import MdClose from '@material-design-icons/svg/filled/close.svg?component-solid';
import { dayjs, useTranslation } from '@revolt/i18n';
import type { Accessor } from 'solid-js';
import { Show } from 'solid-js';
import { decodeTime } from 'ulid';

import { iconSize, styled } from '../../..';
import { FloatingIndicator } from './FloatingIndicator';

interface Props {
  /**
   * The last Id of the message the user read
   */
  lastId: Accessor<string | undefined>;

  /**
   * Jump back to the last message
   */
  jumpBack: () => void;

  /**
   * Dismiss the message
   */
  dismiss: () => void;
}

/**
 * Component indicating to user there were new messages in chat
 */
export function NewMessages(props: Props) {
  const t = useTranslation();

  // TODO: hook escape button

  /**
   * Remove the message
   */
  function onCancel(e: MouseEvent) {
    e.stopPropagation();
    props.dismiss();
  }

  return (
    <Show when={props.lastId()}>
      <FloatingIndicator use:ripple position='top' onClick={props.jumpBack}>
        <span style={{ 'flex-grow': 1 }}>
          {t('app.main.channel.misc.new_messages', {
            time_ago: dayjs(decodeTime(props.lastId()!)).fromNow(),
          })}
        </span>
        <span>{t('app.main.channel.misc.jump_beginning')}</span>
        <CancelIcon onClick={onCancel}>
          <MdClose {...iconSize(16)} />
        </CancelIcon>
      </FloatingIndicator>
    </Show>
  );
}

const CancelIcon = styled.div`
  height: 16px;
`;
