import { useTranslation } from '@revolt/i18n';
import { Avatar, Column } from '@revolt/ui';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to ban server member
 */
const BanMember: PropGenerator<'ban_member'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.context_menu.ban_member'),
    },
    schema: {
      member: 'custom',
      reason: 'text',
    },
    data: {
      member: {
        element: (
          <Column align='center'>
            <Avatar src={props.member.user?.animatedAvatarURL} size={64} />
            {t('app.special.modals.prompt.confirm_ban', {
              name: props.member.user?.username as string,
            })}
          </Column>
        ),
      },
      reason: {
        field: t('app.special.modals.prompt.confirm_ban_reason'),
      },
    },
    callback: async ({ reason }) =>
      void (await props.member.server!.banUser(props.member.id.user, {
        reason,
      })),
    submit: {
      variant: 'error',
      children: t('app.special.modals.actions.ban'),
    },
  });
};

export default BanMember;
