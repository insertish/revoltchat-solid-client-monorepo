import { IS_REVOLT, mapAnyError } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { Column, styled } from '@revolt/ui';
import { createSignal, Match, onMount, Switch } from 'solid-js';

import { modalController } from '..';
import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

/**
 * Code block which displays invite
 */
const Invite = styled(Column)`
  code {
    padding: 1em;
    user-select: all;
    font-size: 1.4em;
    text-align: center;
    font-family: var(--monospace-font);
  }
`;

/**
 * Modal to create a new invite
 */
const CreateInvite: PropGenerator<'create_invite'> = (props) => {
  const t = useTranslation();

  const [processing, setProcessing] = createSignal(false);
  const [link, setLink] = createSignal('...');

  // Generate an invite code
  onMount(() => {
    setProcessing(true);

    props.channel
      .createInvite()
      .then(({ _id }) =>
        setLink(
          IS_REVOLT
            ? `https://rvlt.gg/${_id}`
            : `${window.location.protocol}//${window.location.host}/invite/${_id}`
        )
      )
      .catch((err) =>
        modalController.push({ type: 'error', error: mapAnyError(err) })
      )
      .finally(() => setProcessing(false));
  });

  return createFormModal({
    modalProps: {
      title: t('app.context_menu.create_invite'),
    },
    schema: {
      invite: 'custom',
    },
    data: {
      invite: {
        element: (
          <Switch
            fallback={t('app.special.modals.prompt.create_invite_generate')}
          >
            <Match when={!processing()}>
              <Invite>
                {t('app.special.modals.prompt.create_invite_created')}
                <code>{link()}</code>
              </Invite>
            </Match>
          </Switch>
        ),
      },
    },
    callback: async () => void 0,
    submit: {
      children: t('app.special.modals.actions.ok'),
    },
    actions: [
      {
        children: t('app.context_menu.copy_link'),
        onClick: () => modalController.writeText(link()),
      },
    ],
  });
};

export default CreateInvite;
