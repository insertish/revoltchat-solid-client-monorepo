import MdArrowBack from '@material-design-icons/svg/filled/arrow_back.svg?component-solid';
import { useTranslation } from '@revolt/i18n';
import { useNavigate } from '@revolt/routing';
import { Button, iconSize, Row } from '@revolt/ui';
import { Show } from 'solid-js';

import { FlowTitle } from './Flow';
import { MailProvider } from './MailProvider';

/**
 * Keep track of email within the same session
 */
let email = 'postmaster@revolt.wtf';

/**
 * Persist email information temporarily
 */
export function setFlowCheckEmail(e: string) {
  email = e;
}

/**
 * Flow to tell the user to check their email
 */
export default function FlowCheck() {
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <FlowTitle subtitle={t('login.email_delay')} emoji='mail'>
        {t('login.check_mail')}
      </FlowTitle>
      <Row align justify='center'>
        <a href='..'>
          <Button variant='plain'>
            <MdArrowBack {...iconSize('1.2em')} /> Back
          </Button>
        </a>
        <Show when={email}>
          <MailProvider email={email} />
        </Show>
      </Row>
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
            navigate('/login/verify/abc', { replace: true });
          }}
        >
          Mock Verify
        </div>
      )}
    </>
  );
}
