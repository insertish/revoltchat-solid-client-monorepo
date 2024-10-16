import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal for renaming session
 */
const RenameSession: PropGenerator<'rename_session'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: 'Rename Session',
    },
    schema: {
      name: 'text',
    },
    defaults: {
      name: props.session.name,
    },
    data: {
      name: {
        field: 'Name',
        placeholder: 'Enter a new name for this session',
      },
    },
    callback: async ({ name }) => void (await props.session.rename(name)),
    submit: {
      children: t('app.special.modals.actions.update'),
    },
  });
};

export default RenameSession;
