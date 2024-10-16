import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

// TODO: port the onboarding modal design

/**
 * Modal to pick a new username
 */
const Onboarding: PropGenerator<'onboarding'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: 'Choose username',
    },
    schema: {
      username: 'text',
    },
    data: {
      username: {
        field: 'Username',
      },
    },
    callback: async ({ username }) => await props.callback(username),
    submit: {
      children: 'Good',
    },
  });
};

export default Onboarding;
