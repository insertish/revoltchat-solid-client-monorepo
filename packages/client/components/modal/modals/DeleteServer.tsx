import { useClient } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';

import { modalController } from '..';
import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to delete a server
 */
const DeleteServer: PropGenerator<'delete_server'> = (props) => {
  const t = useTranslation();
  const client = useClient();

  return createFormModal({
    modalProps: {
      title: t('app.special.modals.prompt.confirm_delete', {
        name: props.server.name,
      }),
      description: t('app.special.modals.prompt.confirm_delete_long'),
    },
    schema: {},
    data: {},
    callback: async () => {
      const mfa = await client().account.mfa();
      await modalController.mfaFlow(mfa as never);
      await props.server.delete(); // TODO: should use ticket in API
    },
    submit: {
      variant: 'error',
      children: t('app.special.modals.actions.delete'),
    },
  });
};

export default DeleteServer;
