import MdArrowForward from '@material-design-icons/svg/filled/arrow_forward.svg?component-solid';
import { useTranslation } from '@revolt/i18n';

import { iconSize } from '../../..';
import { FloatingIndicator } from './FloatingIndicator';

interface Props {
  /**
   * Jump back to present messages
   */
  onClick: () => void;
}

/**
 * Component indicating user can jump back to present messages
 */
export function JumpToBottom(props: Props) {
  const t = useTranslation();

  return (
    <FloatingIndicator use:ripple position='bottom' onClick={props.onClick}>
      <span style={{ 'flex-grow': 1 }}>
        {t('app.main.channel.misc.viewing_old')}
      </span>
      <span>{t('app.main.channel.misc.jump_present')}</span>
      <MdArrowForward {...iconSize(16)} />
    </FloatingIndicator>
  );
}
