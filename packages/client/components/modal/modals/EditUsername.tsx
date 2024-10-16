import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal for editing username
 */
const EditUsername: PropGenerator<'edit_username'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.special.modals.account.change.username'),
    },
    schema: {
      username: 'text',
      password: 'password',
    },
    data: {
      username: {
        field: 'Username',
        placeholder: t('login.enter.username'),
      },
      password: {
        field: 'Current Password',
        placeholder: t('login.enter.current_password'),
      },
    },
    callback: async ({ username, password }) =>
      void (await props.client.user!.changeUsername(username, password)),
    submit: {
      children: t('app.special.modals.actions.update'),
    },
  });
};

export default EditUsername;
