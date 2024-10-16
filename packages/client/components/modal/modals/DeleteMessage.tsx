import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to delete a message
 */
const DeleteMessage: PropGenerator<'delete_message'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.context_menu.delete_message'),
      description: t('app.special.modals.prompt.confirm_delete_message_long'),
    },
    schema: {
      message: 'custom',
    },
    data: {
      message: {
        // TODO: find a fix or render part of it?
        element: 'MESSAGE',
      },
    },
    callback: () => props.message.delete(),
    submit: {
      variant: 'error',
      children: t('app.special.modals.actions.delete'),
    },
  });
};

export default DeleteMessage;
