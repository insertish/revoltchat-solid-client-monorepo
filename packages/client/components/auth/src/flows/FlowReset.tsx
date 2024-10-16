import { clientController } from '@revolt/client';
import { CONFIGURATION } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import { useNavigate } from '@revolt/routing';
import { Button, Typography } from '@revolt/ui';

import { FlowTitle } from './Flow';
import { setFlowCheckEmail } from './FlowCheck';
import { Fields, Form } from './Form';

/**
 * Flow for sending password reset
 */
export default function FlowReset() {
  const t = useTranslation();
  const navigate = useNavigate();

  /**
   * Send password reset
   * @param data Form Data
   */
  async function reset(data: FormData) {
    const email = data.get('email') as string;
    const captcha = data.get('captcha') as string;

    await clientController.api.post('/auth/account/reset_password', {
      email,
      captcha,
    });

    setFlowCheckEmail(email);
    navigate('/login/check', { replace: true });
  }

  return (
    <>
      <FlowTitle>{t('login.reset')}</FlowTitle>
      <Form onSubmit={reset} captcha={CONFIGURATION.HCAPTCHA_SITEKEY}>
        <Fields fields={['email']} />
        <Button type='submit'>{t('login.reset')}</Button>
      </Form>
      <Typography variant='legacy-settings-description'>
        <a href='/login/auth'>{t('login.remembered')}</a>
      </Typography>
      {import.meta.env.DEV && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            background: 'white',
            color: 'black',
            cursor: 'pointer',
          }}
          onClick={() => {
            navigate('/login/reset/abc', { replace: true });
          }}
        >
          Mock Reset Screen
        </div>
      )}
    </>
  );
}
