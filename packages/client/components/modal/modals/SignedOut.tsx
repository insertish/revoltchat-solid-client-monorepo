import { useTranslation } from '@revolt/i18n';

import type { PropGenerator } from '../types';

/**
 * Modal to notify the user they've been signed out
 * TODO: show if user is banned, etc
 */
const SignedOut: PropGenerator<'signed_out'> = () => {
  const t = useTranslation();

  return {
    title: t('app.special.modals.signed_out'),
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

export default SignedOut;
