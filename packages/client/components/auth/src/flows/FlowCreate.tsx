import MdArrowBack from '@material-design-icons/svg/filled/arrow_back.svg?component-solid';
import { CONFIGURATION } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import { useNavigate } from '@revolt/routing';
import { Button, iconSize, Row } from '@revolt/ui';

import { clientController } from '../../../client';
import { FlowTitle } from './Flow';
import { setFlowCheckEmail } from './FlowCheck';
import { Fields, Form } from './Form';

/**
 * Flow for creating a new account
 */
export default function FlowCreate() {
  const t = useTranslation();
  const navigate = useNavigate();

  /**
   * Create an account
   * @param data Form Data
   */
  async function create(data: FormData) {
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const captcha = data.get('captcha') as string;

    await clientController.api.post('/auth/account/create', {
      email,
      password,
      captcha,
    });

    // FIXME: should tell client if email was sent
    //        or if email even needs to be confirmed

    // TODO: log straight in if no email confirmation?

    setFlowCheckEmail(email);
    navigate('/login/check', { replace: true });
  }

  return (
    <>
      <FlowTitle subtitle={t('login.subtitle2')} emoji='wave'>
        {t('login.welcome2')}
      </FlowTitle>
      <Form onSubmit={create} captcha={CONFIGURATION.HCAPTCHA_SITEKEY}>
        <Fields fields={['email', 'password']} />
        <Row align justify='center'>
          <a href='..'>
            <Button variant='plain'>
              <MdArrowBack {...iconSize('1.2em')} /> Back
            </Button>
          </a>
          <Button type='submit'>{t('login.register')}</Button>
        </Row>
      </Form>
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
            setFlowCheckEmail('insert@revolt.chat');
            navigate('/login/check', { replace: true });
          }}
        >
          Mock Submission
        </div>
      )}
    </>
  );
}
