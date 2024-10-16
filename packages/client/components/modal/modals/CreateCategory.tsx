import { mapAndRethrowError } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { ulid } from 'ulid';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to create a new category
 */
const CreateCategory: PropGenerator<'create_category'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.context_menu.create_category'),
    },
    schema: {
      name: 'text',
    },
    data: {
      name: {
        field: t('app.main.servers.channel_name'),
      },
    },
    callback: async ({ name }) => {
      await props.server
        .edit({
          categories: [
            ...(props.server.categories ?? []),
            {
              id: ulid(),
              title: name,
              channels: [],
            },
          ],
        })
        .catch(mapAndRethrowError);
    },
    submit: {
      children: t('app.special.modals.actions.create'),
    },
  });
};

export default CreateCategory;
