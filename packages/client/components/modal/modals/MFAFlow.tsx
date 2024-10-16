import { useTranslation } from '@revolt/i18n';
import { CategoryButton, Input, Preloader, Typography } from '@revolt/ui';
import type { API } from 'revolt.js';
import { BiRegularArchive, BiSolidKey, BiSolidKeyboard } from 'solid-icons/bi';
import {
  createEffect,
  createSignal,
  For,
  Match,
  onMount,
  Switch,
} from 'solid-js';

import type { PropGenerator } from '../types';

/**
 * Modal to create an MFA ticket
 */
const MFAFlow: PropGenerator<'mfa_flow'> = (props) => {
  const t = useTranslation();

  // Keep track of available methods
  const [methods, setMethods] = createSignal<API.MFAMethod[] | undefined>(
    // eslint-disable-next-line solid/reactivity
    props.state === 'unknown' ? props.available_methods : undefined
  );

  // Current state of the modal
  const [selectedMethod, setSelected] = createSignal<API.MFAMethod>();
  const [response, setResponse] = createSignal<API.MFAResponse>();

  // Fetch available methods if they have not been provided.
  onMount(() => {
    if (!methods() && props.state === 'known') {
      setMethods(props.mfa.availableMethods);
    }
  });

  // Always select first available method if only one available.
  createEffect(() => {
    const list = methods();
    if (list) {
      setSelected(list.find((entry) => entry !== 'Recovery'));
    }
  });

  /**
   * Callback to generate a new ticket or send response back up the chain
   */
  const generateTicket = async () => {
    const mfa_response = response();
    if (!mfa_response) return false;

    if (props.state === 'known') {
      const ticket = await props.mfa.createTicket(mfa_response);
      props.callback(ticket);
    } else {
      props.callback(mfa_response);
    }

    return true;
  };

  return {
    title: t('app.special.modals.confirm'),
    description: (
      <Switch fallback={t('app.special.modals.mfa.select_method')}>
        <Match when={selectedMethod()}>
          {t('app.special.modals.mfa.confirm')}
        </Match>
      </Switch>
    ),
    actions: () =>
      selectedMethod()
        ? [
            {
              palette: 'primary',
              children: t('app.special.modals.actions.confirm'),
              onClick: generateTicket,
              confirmation: true,
            },
            {
              palette: 'plain',
              children: t(
                `app.special.modals.actions.${
                  methods()!.length === 1 ? 'cancel' : 'back'
                }`
              ),
              onClick: () => {
                if (methods()!.length === 1) {
                  props.callback();
                  return true;
                }

                setSelected(undefined);
              },
            },
          ]
        : [
            {
              palette: 'plain',
              children: t('app.special.modals.actions.cancel'),
              onClick: () => {
                props.callback();
                return true;
              },
            },
          ],
    // If we are logging in or have selected a method,
    // don't allow the user to dismiss the modal by clicking off.
    // This is to just generally prevent annoying situations
    // where you accidentally close the modal while logging in
    // or when switching to your password manager.
    nonDismissable:
      // eslint-disable-next-line solid/reactivity
      props.state === 'unknown' || typeof selectedMethod !== 'undefined',
    children: (
      <Switch fallback={<Preloader type='ring' />}>
        <Match when={selectedMethod()}>
          <Typography variant='label'>
            {t(`login.${selectedMethod()!.toLowerCase()}`)}
          </Typography>
          <Switch>
            <Match when={selectedMethod() === 'Password'}>
              <Input
                type='password'
                value={(response() as { password: string })?.password}
                onChange={(e) =>
                  setResponse({ password: e.currentTarget.value })
                }
              />
            </Match>
            <Match when={selectedMethod() === 'Totp'}>
              <Input
                type='text'
                value={(response() as { totp_code: string })?.totp_code}
                onChange={(e) =>
                  setResponse({ totp_code: e.currentTarget.value })
                }
              />
            </Match>
            <Match when={selectedMethod() === 'Recovery'}>
              <Input
                type='text'
                value={(response() as { recovery_code: string })?.recovery_code}
                onChange={(e) =>
                  setResponse({ recovery_code: e.currentTarget.value })
                }
              />
            </Match>
          </Switch>
        </Match>
        <Match when={methods()}>
          <For each={methods()}>
            {(method) => (
              <CategoryButton
                action='chevron'
                icon={
                  <Switch>
                    <Match when={method === 'Password'}>
                      <BiSolidKeyboard size={24} />
                    </Match>
                    <Match when={method === 'Totp'}>
                      <BiSolidKey size={24} />
                    </Match>
                    <Match when={method === 'Recovery'}>
                      <BiRegularArchive size={24} />
                    </Match>
                  </Switch>
                }
                onClick={() => {
                  setSelected(method);
                  setResponse(undefined);
                }}
              >
                {t(`login.${method.toLowerCase()}`)}
              </CategoryButton>
            )}
          </For>
        </Match>
      </Switch>
    ),
  };
};

export default MFAFlow;
