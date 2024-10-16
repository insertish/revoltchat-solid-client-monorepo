import { useTranslation } from '@revolt/i18n';
import { Avatar, Column } from '@revolt/ui';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to kick server member
 */
const KickMember: PropGenerator<'kick_member'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.context_menu.kick_member'),
    },
    schema: {
      member: 'custom',
    },
    data: {
      member: {
        element: (
          <Column align='center'>
            <Avatar src={props.member.user?.animatedAvatarURL} size={64} />
            {t('app.special.modals.prompt.confirm_kick', {
              name: props.member.user?.username as string,
            })}
          </Column>
        ),
      },
    },
    callback: () => props.member.kick(),
    submit: {
      variant: 'error',
      children: t('app.special.modals.actions.ban'),
    },
  });
};

export default KickMember;
