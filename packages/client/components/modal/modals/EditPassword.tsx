import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal for editing password
 */
const EditPassword: PropGenerator<'edit_password'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.special.modals.account.change.password'),
    },
    schema: {
      password: 'password',
      currentPassword: 'password',
    },
    data: {
      password: {
        field: t('login.password'),
        placeholder: t('login.enter.password'),
      },
      currentPassword: {
        field: t('login.current_password'),
        placeholder: t('login.enter.current_password'),
      },
    },
    callback: async ({ password, currentPassword }) =>
      void (await props.client.account.changePassword(
        password,
        currentPassword
      )),
    submit: {
      children: t('app.special.modals.actions.update'),
    },
  });
};

export default EditPassword;
