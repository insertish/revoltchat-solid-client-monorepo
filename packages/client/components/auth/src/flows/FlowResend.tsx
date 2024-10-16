import { clientController } from '@revolt/client';
import { CONFIGURATION } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import { useNavigate } from '@revolt/routing';
import { Button, Typography } from '@revolt/ui';

import { FlowTitle } from './Flow';
import { setFlowCheckEmail } from './FlowCheck';
import { Fields, Form } from './Form';

/**
 * Flow for resending email verification
 */
export default function FlowResend() {
  const t = useTranslation();
  const navigate = useNavigate();

  /**
   * Resend email verification
   * @param data Form Data
   */
  async function resend(data: FormData) {
    const email = data.get('email') as string;
    const captcha = data.get('captcha') as string;

    await clientController.api.post('/auth/account/reverify', {
      email,
      captcha,
    });

    setFlowCheckEmail(email);
    navigate('/login/check', { replace: true });
  }

  return (
    <>
      <FlowTitle>{t('login.resend')}</FlowTitle>
      <Form onSubmit={resend} captcha={CONFIGURATION.HCAPTCHA_SITEKEY}>
        <Fields fields={['email']} />
        <Button type='submit'>{t('login.resend')}</Button>
      </Form>
      <Typography variant='legacy-settings-description'>
        <a href='/login/auth'>{t('login.remembered')}</a>
      </Typography>
    </>
  );
}
