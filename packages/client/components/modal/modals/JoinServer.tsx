import { useTranslation } from '@revolt/i18n';
import { useNavigate } from '@revolt/routing';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

const RE_INVITE_URL = /(?:invite|rvlt.gg)\/([a-z0-9]+)/gi;

/**
 * Modal to join a server
 */
const JoinServer: PropGenerator<'join_server'> = (props) => {
  const t = useTranslation();
  const navigate = useNavigate();

  return createFormModal({
    modalProps: {
      title: 'Join a server',
      description: <>Use a code or invite link</>,
    },
    schema: {
      link: 'text',
    },
    data: {
      link: {
        field: 'code',
        placeholder: 'rvlt.gg/wVEJDGVs',
      },
    },
    callback: async ({ link }) => {
      let code = link;
      const match = RE_INVITE_URL.exec(link);
      if (match) code = match[1];

      // fetch invite and display
      // console.info(code);

      // TODO: replace
      const result = await props.client.api.post(`/invites/${code}`);
      if (result.type === 'Server') {
        navigate(`/server/${result.server._id}`);
      } else {
        // TODO: group
        // navigate(`/channel/${result.channels}`);
      }
    },
    submit: {
      children: 'Join',
    },
  });
};

export default JoinServer;
