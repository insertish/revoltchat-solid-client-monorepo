import { clientController, mapAnyError } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { useNavigate, useParams } from '@revolt/routing';
import { Button, Preloader, Typography } from '@revolt/ui';
import { createSignal, Match, onMount, Show, Switch } from 'solid-js';

import { FlowTitle } from './Flow';

type State =
  | {
      state: 'verifying';
    }
  | {
      state: 'error';
      error: string;
    }
  | {
      state: 'success';
      mfa_ticket?: string;
    };

/**
 * Flow for confirming email
 */
export default function FlowVerify() {
  const t = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const [state, setState] = createSignal<State>({
    state: 'verifying',
  });

  onMount(async () => {
    try {
      if (import.meta.env.DEV) {
        if (confirm('Mock verification?')) {
          if (confirm('Successful verification?')) {
            setState({ state: 'success', mfa_ticket: 'token' });
          } else {
            setState({ state: 'error', error: 'InvalidToken' });
          }

          return;
        }
      }

      const data = (await clientController.api.post(
        `/auth/account/verify/${params.token}`
      )) as { ticket?: { token: string } };

      setState({ state: 'success', mfa_ticket: data.ticket?.token });
    } catch (err) {
      setState({ state: 'error', error: mapAnyError(err) });
    }
  });

  /**
   * Use MFA ticket to log into Revolt
   */
  async function login() {
    const v = state();
    if (v.state === 'success' && v.mfa_ticket) {
      await clientController.login({
        mfa_ticket: v.mfa_ticket,
      });

      navigate('/login/auth', { replace: true });
    }
  }

  return (
    <Switch>
      <Match when={state().state === 'verifying'}>
        <FlowTitle>{t('login.verifying_account')}</FlowTitle>
        <Preloader type='ring' />
      </Match>
      <Match when={state().state === 'error'}>
        <FlowTitle>{t('login.error.verify')}</FlowTitle>
        <Typography variant='legacy-settings-description'>
          {t(
            `error.${(state() as State & { state: 'error' }).error}`,
            undefined,
            (state() as State & { state: 'error' }).error
          )}
        </Typography>
        <Typography variant='legacy-settings-description'>
          <a href='/login/auth'>{t('login.remembered')}</a>
        </Typography>
      </Match>
      <Match when={state().state === 'success'}>
        <FlowTitle>{t('login.verified_account')}</FlowTitle>
        <Show when={'mfa_ticket' in state()}>
          <Button onClick={login}>{t('login.verified_continue')}</Button>
        </Show>
        <Typography variant='legacy-settings-description'>
          <a href='/login/auth'>{t('login.remembered')}</a>
        </Typography>
      </Match>
    </Switch>
  );
}
