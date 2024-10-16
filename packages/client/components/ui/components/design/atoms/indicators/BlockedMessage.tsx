import MdClose from '@material-design-icons/svg/filled/close.svg?component-solid';
import { useTranslation } from '@revolt/i18n';
import { styled } from 'solid-styled-components';

import { iconSize } from '../../../..';

/**
 * Base styles
 */
const Base = styled('div')<{ unread?: boolean }>`
  display: flex;
  align-items: center;

  gap: ${(props) => props.theme!.gap.s};
  margin-top: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  padding: ${(props) => props.theme!.gap.sm} ${(props) => props.theme!.gap.xxl};

  font-size: 0.8em; /* TODO should be in typography */
  color: ${(props) =>
    props.theme!.colours['messaging-component-blocked-message-foreground']};
  fill: ${(props) =>
    props.theme!.colours['messaging-component-blocked-message-foreground']};
  background: ${(props) =>
    props.theme!.colours['messaging-component-blocked-message-background']};
`;

interface Props {
  /**
   * Number of blocked messages
   */
  count: number;
}

/**
 * Generic message divider
 */
export function BlockedMessage(props: Props) {
  const t = useTranslation();

  return (
    <Base use:ripple={{ enable: false }}>
      <MdClose {...iconSize(16)} />{' '}
      {t('app.main.channel.misc.blocked_messages', {
        count: props.count.toString(),
      })}
    </Base>
  );
}
