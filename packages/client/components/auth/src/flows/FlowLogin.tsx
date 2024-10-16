import MdArrowBack from '@material-design-icons/svg/filled/arrow_back.svg?component-solid';
import { State, TransitionType } from '@revolt/client/Controller';
import { useTranslation } from '@revolt/i18n';
import { Navigate } from '@revolt/routing';
import {
  Button,
  Column,
  iconSize,
  Preloader,
  Row,
  Typography,
} from '@revolt/ui';
import { Match, Show, Switch } from 'solid-js';
import { styled } from 'styled-system/jsx';

// import RevoltSvg from "../../../../public/assets/wordmark_wide_500px.svg?component-solid";
import { clientController } from '../../../client';
import { FlowTitle } from './Flow';
import { Fields, Form } from './Form';

const Logo = styled('div', {
  base: {
    height: '0.8em',
    display: 'inline',
    fill: 'var(--colours-messaging-message-box-foreground)',
  },
});

/**
 * Flow for logging into an account
 */
export default function FlowLogin() {
  const t = useTranslation();

  /**
   * Log into account
   * @param data Form Data
   */
  async function login(data: FormData) {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    await clientController.login({
      email,
      password,
    });
  }

  /**
   * Select a new username
   * @param data Form Data
   */
  async function select(data: FormData) {
    const username = data.get('username') as string;
    await clientController.selectUsername(username);
  }

  return (
    <>
      <Switch
        fallback={
          <>
            <FlowTitle subtitle={t('login.subtitle')} emoji='wave'>
              {t('login.welcome')}
            </FlowTitle>

            <Form onSubmit={login}>
              <Fields fields={['email', 'password']} />
              <Row align justify='center'>
                <a href='..'>
                  <Button variant='plain'>
                    <MdArrowBack {...iconSize('1.2em')} /> Back
                  </Button>
                </a>
                <Button type='submit'>{t('login.title')}</Button>
              </Row>
            </Form>

            <Column>
              <Typography variant='legacy-settings-description'>
                <a href='/login/reset'>{t('login.reset')}</a>
              </Typography>

              <Typography variant='legacy-settings-description'>
                <a href='/login/resend'>{t('login.resend')}</a>
              </Typography>
            </Column>
          </>
        }
      >
        <Match when={clientController.isLoggedIn()}>
          <Navigate href='/app' />
        </Match>
        <Match when={clientController.lifecycle.state() === State.LoggingIn}>
          <Preloader type='ring' />
        </Match>
        <Match when={clientController.lifecycle.state() === State.Onboarding}>
          <FlowTitle subtitle={t('app.special.modals.onboarding.pick')}>
            <Row gap='sm'>
              {t('app.special.modals.onboarding.welcome')} <Logo />
            </Row>
          </FlowTitle>

          <Form onSubmit={select}>
            <Fields fields={['username']} />
            <Row align justify='center'>
              <Button
                variant='plain'
                onClick={() =>
                  clientController.lifecycle.transition({
                    type: TransitionType.Cancel,
                  })
                }
              >
                <MdArrowBack {...iconSize('1.2em')} /> Cancel
              </Button>
              <Button type='submit'>
                {t('app.special.modals.actions.confirm')}
              </Button>
            </Row>
          </Form>
        </Match>
      </Switch>
    </>
  );
}
