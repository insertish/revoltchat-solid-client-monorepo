import { mapAndRethrowError } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to create a new bot
 */
const CreateBot: PropGenerator<'create_bot'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t('app.special.popovers.create_bot.title'),
    },
    schema: {
      name: 'text',
    },
    data: {
      name: {
        field: t('login.username'),
      },
    },
    callback: async ({ name }) => {
      const bot = await props.client.bots
        .createBot(name)
        .catch(mapAndRethrowError);

      props.onCreate(bot);
    },
    submit: {
      children: t('app.special.modals.actions.create'),
    },
  });
};

export default CreateBot;
