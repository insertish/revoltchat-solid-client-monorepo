import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to delete a bot
 */
const DeleteBot: PropGenerator<'delete_bot'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.special.modals.prompt.confirm_delete', {
        name: props.bot.user!.displayName,
      }),
      description: t('app.special.modals.prompt.confirm_delete_long'),
    },
    schema: {},
    data: {},
    callback: () => props.bot.delete(),
    submit: {
      variant: 'error',
      children: t('app.special.modals.actions.delete'),
    },
  });
};

export default DeleteBot;
