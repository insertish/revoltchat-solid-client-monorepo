import type { Component, JSX } from 'solid-js';
import { Match, Show, Switch } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Time } from '../../design/atoms/display/Time';
import {
  generateTypographyCSS,
  Typography,
} from '../../design/atoms/display/Typography';
import {
  Column,
  NonBreakingText,
  OverflowingText,
  Row,
} from '../../design/layout';

interface CommonProps {
  /**
   * Whether this is the tail of another message
   */
  tail?: boolean;

  /**
   * Whether to move the username and related to the left
   *
   * If you want to hide it completely, add a <Match when={true} /> to infoMatch
   */
  compact?: boolean;
}

type Props = CommonProps & {
  /**
   * Avatar URL
   */
  avatar: JSX.Element;

  /**
   * Username element
   */
  username: JSX.Element;

  /**
   * Message content
   */
  children: JSX.Element;

  /**
   * Message header
   */
  header?: JSX.Element;

  /**
   * Message info line
   */
  info?: JSX.Element;

  /**
   * Timestamp message was sent at
   */
  timestamp: Date | string;

  /**
   * Date message was edited at
   */
  edited?: Date;

  /**
   * Whether this message mentions the user
   */
  mentioned?: boolean;

  /**
   * Whether this message should be highlighted
   */
  highlight?: boolean;

  /**
   * Send status of this message
   */
  sendStatus?: 'sending' | 'failed';

  /**
   * Component to render message context menu
   */
  contextMenu?: () => JSX.Element;

  /**
   * Additional match cases for the inline-start information element
   */
  infoMatch?: JSX.Element;

  /**
   * Reference time to render timestamps from
   */
  _referenceTime?: number;
};

/**
 * Message container layout
 */
const Base = styled(Column as Component, 'Message')<
  CommonProps & Pick<Props, 'mentioned' | 'highlight' | 'sendStatus'>
>`
  ${(props) => generateTypographyCSS(props.theme!, 'messages')}

  padding: 2px 0;
  color: ${(props) =>
    props.sendStatus === 'failed'
      ? props.theme!.customColours.error.color
      : props.theme!.colours.foreground};
  background: ${(props) =>
    props.mentioned
      ? props.theme!.colours['messaging-message-mentioned-background']
      : 'transparent'};
  margin-top: ${(props) => (props.tail ? 0 : '12px')} !important;
  border-radius: ${(props) => props.theme!.borderRadius.md};
  min-height: 1em;

  ${(props) => (props.highlight ? 'outline: 2px solid red;' : '')}

  .hidden {
    display: none;
  }

  &:hover {
    .hidden {
      display: block;
    }
  }

  a:hover {
    text-decoration: underline;
  }
`;

/**
 * Left-side information or avatar
 */
const Info = styled('div', 'Info')<Pick<CommonProps, 'tail' | 'compact'>>`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: ${(props) => (props.tail ? 0 : 2)}px 0;
  ${(props) => (props.compact ? '' : 'width: 62px;')}
`;

/**
 * Right-side message content
 */
const Content = styled(Column)`
  gap: 3px;
  min-width: 0;
  overflow: hidden;
  max-height: 200vh;
  padding-inline-end: ${(props) => props.theme!.gap.lg};
`;

/**
 * Information text
 */
const InfoText = styled(Row)`
  color: var(--unset-fg);
  ${(props) => generateTypographyCSS(props.theme!, 'small')}
`;

/**
 * Additional styles for compact mode
 */
const CompactInfo = styled(Row)`
  flex-shrink: 0;
  margin-top: -2px;
  height: fit-content;
  padding-inline: ${(props) => props.theme!.gap.lg} 0;
`;

/**
 * Component to show avatar, username, timestamp and content
 */
export function MessageContainer(props: Props) {
  return (
    <Base
      tail={props.tail}
      mentioned={props.mentioned}
      highlight={props.highlight}
      sendStatus={props.sendStatus}
      use:floating={{ contextMenu: props.contextMenu }}
      use:ripple={{ enable: false }}
    >
      {props.header}
      <Row gap='none'>
        <Info tail={props.tail} compact={props.compact}>
          <Switch fallback={props.avatar}>
            {props.infoMatch ?? <Match when={false} children={null} />}
            <Match when={props.compact}>
              <CompactInfo gap='sm' align>
                <InfoText gap='sm'>
                  <Time
                    format='time'
                    value={props.timestamp}
                    referenceTime={props._referenceTime}
                  />
                </InfoText>
                {props.username}
                {props.info}
              </CompactInfo>
            </Match>
            <Match when={props.tail}>
              <InfoText class={!props.edited ? 'hidden' : undefined}>
                <Typography variant='small'>
                  <Show when={props.edited}>(edited)</Show>
                  <Show when={!props.edited}>
                    <Time
                      value={props.timestamp}
                      format='time'
                      referenceTime={props._referenceTime}
                    />
                  </Show>
                </Typography>
              </InfoText>
            </Match>
          </Switch>
        </Info>
        <Content>
          <Show when={!props.tail && !props.compact}>
            <Row gap='sm' align>
              <OverflowingText>{props.username}</OverflowingText>
              <NonBreakingText>
                <InfoText gap='sm' align>
                  {props.info}
                  <Switch fallback={props.timestamp as string}>
                    <Match when={props.timestamp instanceof Date}>
                      <Time
                        format='calendar'
                        value={props.timestamp}
                        referenceTime={props._referenceTime}
                      />
                    </Match>
                  </Switch>
                  <Show when={props.edited}>
                    <span>(edited)</span>
                  </Show>
                </InfoText>
              </NonBreakingText>
            </Row>
          </Show>
          {props.children}
        </Content>
      </Row>
    </Base>
  );
}
