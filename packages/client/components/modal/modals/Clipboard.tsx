import { useTranslation } from '@revolt/i18n';

import type { PropGenerator } from '../types';

/**
 * Modal to display some text which could not be written to the browser clipboard
 */
const Clipboard: PropGenerator<'clipboard'> = (props) => {
  const t = useTranslation();

  return {
    title: t('app.special.modals.clipboard.unavailable'),
    description:
      location.protocol !== 'https:'
        ? t('app.special.modals.clipboard.https')
        : undefined,
    actions: [
      {
        onClick: () => true,
        confirmation: true,
        children: t('app.special.modals.actions.close'),
      },
    ],
    children: (
      <>
        {t('app.special.modals.clipboard.copy')}
        <br />
        <code style={{ 'user-select': 'all', 'word-break': 'break-all' }}>
          {props.text}
        </code>
      </>
    ),
  };
};

export default Clipboard;
