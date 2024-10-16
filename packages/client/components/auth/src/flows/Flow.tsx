import { Column, Row, Typography } from '@revolt/ui';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import { keyframes, styled } from 'solid-styled-components';

import envelope from './envelope.svg';
import wave from './wave.svg';

/**
 * Container for authentication page flows
 */
export const FlowBase = styled(Column)`
  background: ${
    (props) =>
      props.theme!.colours[
        'messaging-message-box-background'
      ] /* TODO: change and in other places */
  };
  color: ${(props) => props.theme!.colours['messaging-message-box-foreground']};

  /* background-color: rgba(36, 36, 36, 0.75);
   backdrop-filter: blur(20px); */
  /* // border: 2px solid rgba(128, 128, 128, 0.15); */

  gap: ${(props) => props.theme!.gap.lg};

  max-width: 360px;
  max-height: 600px;
  /* padding: 30px 25px; */
  padding: 45px 40px;
  border-radius: 32px;

  margin-top: 20px;
  margin-bottom: 20px;
  /* // box-shadow: 0 2px 10px rgb(0 0 0 / 20%); */

  justify-self: center;
  margin-inline: auto;

  a,
  a:link,
  a:visited,
  a:active {
    text-decoration: none;
    color: var(--unset-fg);
  }
`;

/**
 * Wave animation
 */
const WaveAnimation = keyframes`
  0% {
    transform: rotate(0);
  }
  10% {
    transform: rotate(14deg);
  }
  20% {
    transform: rotate(-8deg);
  }
  30% {
    transform: rotate(14deg);
  }
  40% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(0);
  }
`;

/**
 * Envelope animation
 */
const EnvelopeAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-24px);
  }
  100% {
    opacity: 1;
    transform: translateY(-4px);
  }
`;

/**
 * Wave emoji
 */
const Wave = styled.img`
  height: 1.8em;

  animation-duration: 2.5s;
  animation-iteration-count: 1;
  animation-name: ${WaveAnimation};
`;

/**
 * Mail emoji
 */
const Mail = styled.img`
  height: 1.8em;
  transform: translateY(-4px);

  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-timing-function: ease;
  animation-name: ${EnvelopeAnimation};
`;

/**
 * Common flow title component
 */
export function FlowTitle(props: {
  children: JSX.Element;
  subtitle?: JSX.Element;
  emoji?: 'wave' | 'mail';
}) {
  return (
    <Column>
      <Row align gap='sm'>
        <Show when={props.emoji === 'wave'}>
          <Wave src={wave} />
        </Show>
        <Show when={props.emoji === 'mail'}>
          <Mail src={envelope} />
        </Show>
        <Typography variant='legacy-settings-title'>
          {props.children}
        </Typography>
      </Row>
      <Show when={props.subtitle}>
        <Typography variant='legacy-settings-description'>
          {props.subtitle}
        </Typography>
      </Show>
    </Column>
  );
}
