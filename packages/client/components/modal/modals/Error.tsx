import { useTranslation } from '@revolt/i18n';

import type { PropGenerator } from '../types';

/**
 * Modal to notify the user they've been signed out
 */
const Error: PropGenerator<'error'> = (props) => {
  const t = useTranslation();

  return {
    title: t('app.special.modals.signed_out'),
    children: <span>{props.error}</span>,
    actions: [
      {
        children: t('app.special.modals.actions.ok'),
        palette: 'secondary',
        onClick() {
          return true;
        },
      },
    ],
  };
};

export default Error;
