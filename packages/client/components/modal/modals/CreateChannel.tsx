import { mapAndRethrowError } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { useNavigate } from '@revolt/routing';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Modal to create a new server channel
 */
const CreateChannel: PropGenerator<'create_channel'> = (props) => {
  const t = useTranslation();
  const navigate = useNavigate();

  return createFormModal({
    modalProps: {
      title: t('app.context_menu.create_channel'),
    },
    schema: {
      name: 'text',
      type: 'radio',
    },
    data: {
      name: {
        field: t('app.main.servers.channel_name'),
      },
      type: {
        field: t('app.main.servers.channel_type'),
        choices: [
          {
            name: t('app.main.servers.text_channel'),
            value: 'Text',
          },
          {
            name: t('app.main.servers.voice_channel'),
            value: 'Voice',
          },
        ],
      },
    },
    defaults: {
      type: 'Text',
    },
    callback: async ({ name, type }) => {
      const channel = await props.server
        .createChannel({
          type: type as 'Text' | 'Voice',
          name,
        })
        .catch((err) => {
          throw mapAndRethrowError(err);
        });

      if (props.cb) {
        props.cb(channel);
      } else {
        navigate(`/server/${props.server.id}/channel/${channel.id}`);
      }
    },
    submit: {
      children: t('app.special.modals.actions.create'),
    },
  });
};

export default CreateChannel;
