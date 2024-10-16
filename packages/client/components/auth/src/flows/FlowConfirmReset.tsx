import { clientController } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { useNavigate, useParams } from '@revolt/routing';
import { Button, Typography } from '@revolt/ui';

import { FlowTitle } from './Flow';
import { Fields, Form } from './Form';

/**
 * Flow for confirming a new password
 */
export default function FlowConfirmReset() {
  const t = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  /**
   * Confirm new password
   * @param data Form Data
   */
  async function reset(data: FormData) {
    const password = data.get('new-password') as string;
    const remove_sessions = !!(data.get('log-out') as 'on' | undefined);

    await clientController.api.patch('/auth/account/reset_password', {
      password,
      token,
      remove_sessions,
    });

    navigate('/login/auth', { replace: true });
  }

  return (
    <>
      <FlowTitle>{t('login.reset')}</FlowTitle>
      <Form onSubmit={reset}>
        <Fields fields={['new-password', 'log-out']} />
        <Button type='submit'>{t('login.reset')}</Button>
      </Form>
      <Typography variant='legacy-settings-description'>
        <a href='/login/auth'>{t('login.remembered')}</a>
      </Typography>
    </>
  );
}
