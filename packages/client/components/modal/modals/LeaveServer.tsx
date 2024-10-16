import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to leave a server
 */
const LeaveServer: PropGenerator<'leave_server'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.special.modals.prompt.confirm_leave', {
        name: props.server.name,
      }),
      description: t('app.special.modals.prompt.confirm_leave_long'),
    },
    schema: {
      silent: 'checkbox',
    },
    data: {
      silent: {
        title: t('app.special.modals.prompt.silent_leave'),
        description: t('app.special.modals.prompt.members_not_notified'),
      },
    },
    callback: (data) => props.server.delete(data.silent),
    submit: {
      variant: 'error',
      children: t('app.special.modals.actions.leave'),
    },
  });
};

export default LeaveServer;
