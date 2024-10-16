import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal for editing email
 */
const EditEmail: PropGenerator<'edit_email'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.special.modals.account.change.email'),
    },
    schema: {
      email: 'text',
      currentPassword: 'password',
    },
    data: {
      email: {
        field: t('login.email'),
        placeholder: t('login.enter.username'),
      },
      currentPassword: {
        field: t('login.current_password'),
        placeholder: t('login.enter.current_password'),
      },
    },
    callback: async ({ email, currentPassword }) =>
      void (await props.client.account.changeEmail(email, currentPassword)),
    submit: {
      children: t('app.special.modals.actions.update'),
    },
  });
};

export default EditEmail;
