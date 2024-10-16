import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to create a new server role
 */
const CreateInvite: PropGenerator<'create_role'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.settings.permissions.create_role'),
    },
    schema: {
      name: 'text',
    },
    data: {
      name: {
        field: t('app.settings.permissions.role_name'),
      },
    },
    callback: async ({ name }) => {
      const role = await props.server.createRole(name);
      props.callback(role.id);
    },
    submit: {
      children: t('app.special.modals.actions.create'),
    },
  });
};

export default CreateInvite;
