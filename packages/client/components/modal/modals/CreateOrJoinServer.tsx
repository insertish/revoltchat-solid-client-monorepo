import MdAdd from '@material-design-icons/svg/outlined/add.svg?component-solid';
import MdLink from '@material-design-icons/svg/outlined/link.svg?component-solid';
import { useTranslation } from '@revolt/i18n';
import { iconSize, styled } from '@revolt/ui';

import { modalController } from '..';
import type { PropGenerator } from '../types';

/**
 * Modal to create or join a server
 */
const CreateOrJoinServer: PropGenerator<'create_or_join_server'> = (props) => {
  const t = useTranslation();

  return {
    title: 'Create or join a server',
    description: (
      <Base>
        <a
          onClick={() => {
            modalController.pop();
            modalController.push({
              type: 'create_server',
              client: props.client,
            });
          }}
        >
          <MdAdd {...iconSize(48)} />
          Create
        </a>
        <a
          onClick={() => {
            modalController.pop();
            modalController.push({ type: 'join_server', client: props.client });
          }}
        >
          <MdLink {...iconSize(48)} />
          Join
        </a>
      </Base>
    ),
  };
};

// example
const Base = styled.div`
  gap: 8px;
  padding: 8px;
  display: flex;
  flex-direction: row;

  /* maybe use M3 Cards? TODO */
  a {
    width: 128px;
    height: 128px;

    display: grid;
    place-items: center;

    border-radius: 8px;
    background: ${(props) =>
      props.theme!.colours['sidebar-channels-background']};
  }
`;

export default CreateOrJoinServer;
