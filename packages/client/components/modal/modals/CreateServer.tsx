import { mapAndRethrowError } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { useNavigate } from '@revolt/routing';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to create a new server
 */
const CreateServer: PropGenerator<'create_server'> = (props) => {
  const t = useTranslation();
  const navigate = useNavigate();

  return createFormModal({
    modalProps: {
      title: t('app.main.servers.create'),
      description: (
        <>
          By creating this server, you agree to the{' '}
          <a href='https://revolt.chat/aup' target='_blank' rel='noreferrer'>
            Acceptable Use Policy
          </a>
          .
        </>
      ),
    },
    schema: {
      name: 'text',
    },
    data: {
      name: {
        field: t('app.main.servers.name'),
      },
    },
    callback: async ({ name }) => {
      const server = await props.client.servers
        .createServer({
          name,
        })
        .catch(mapAndRethrowError);

      setTimeout(() => navigate(`/server/${server.id}`));
    },
    submit: {
      children: t('app.special.modals.actions.create'),
    },
  });
};

export default CreateServer;
