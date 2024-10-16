import { clientController } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { Navigate } from '@revolt/routing';
import { Button, Column, styled } from '@revolt/ui';
import { Show } from 'solid-js';

// import RevoltSvg from "../../../../public/assets/wordmark_wide_500px.svg?component-solid";

const Logo = styled('div')`
  width: 100%;
  object-fit: contain;
  fill: ${(props) => props.theme!.colours['messaging-message-box-foreground']};
`;

/**
 * Flow for logging into an account
 */
export default function FlowHome() {
  const t = useTranslation();

  return (
    <>
      <Show when={clientController.isLoggedIn()}>
        <Navigate href='/app' />
      </Show>

      <Column gap='xl'>
        <Logo />

        <Column>
          <b
            style={{
              'font-weight': 800,
              'font-size': '1.4em',
              display: 'flex',
              'flex-direction': 'column',
              'align-items': 'center',
            }}
          >
            <span>Find your community,</span>
            <br />
            <span>connect with the world.</span>
          </b>
          <span style={{ 'text-align': 'center', opacity: '0.5' }}>
            Revolt is one of the best ways to stay connected with your friends
            and community, anywhere, anytime.
          </span>
        </Column>

        <Column>
          <a href='/login/auth'>
            <Column>
              <Button>Log In</Button>
            </Column>
          </a>
          <a href='/login/create'>
            <Column>
              <Button variant='secondary'>Sign Up</Button>
            </Column>
          </a>
        </Column>
      </Column>
    </>
  );
}
