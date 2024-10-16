import { useTranslation } from '@revolt/i18n';
import { TextWithEmoji } from '@revolt/markdown';
import { modalController } from '@revolt/modal';
import { state } from '@revolt/state';
import { LAYOUT_SECTIONS } from '@revolt/state/stores/Layout';
import {
  Button,
  NonBreakingText,
  OverflowingText,
  Spacer,
  styled,
  Typography,
  UserStatus,
} from '@revolt/ui';
import type { Channel } from 'revolt.js';
import {
  BiRegularAt,
  BiRegularHash,
  BiSolidCog,
  BiSolidGroup,
  BiSolidNotepad,
} from 'solid-icons/bi';
import { Match, Show, Switch } from 'solid-js';

import { HeaderIcon } from '../common/CommonHeader';

interface Props {
  /**
   * Channel to render header for
   */
  channel: Channel;
}

/**
 * Common channel header component
 */
export function ChannelHeader(props: Props) {
  const t = useTranslation();

  /**
   * Open channel information modal
   */
  function openChannelInfo() {
    modalController.push({
      type: 'channel_info',
      channel: props.channel,
    });
  }

  /**
   * Open channel settings
   */
  function openChannelSettings() {
    modalController.push({
      type: 'settings',
      config: 'channel',
      context: props.channel,
    });
  }

  return (
    <>
      <Switch>
        <Match
          when={
            props.channel.type === 'TextChannel' ||
            props.channel.type === 'VoiceChannel' ||
            props.channel.type === 'Group'
          }
        >
          <HeaderIcon>
            <BiRegularHash size={24} />
          </HeaderIcon>
          <NonBreakingText>
            <TextWithEmoji content={props.channel.name!} />
          </NonBreakingText>
          <Show when={props.channel.description}>
            <Divider />
            <DescriptionLink onClick={openChannelInfo}>
              <OverflowingText>
                <Typography variant='channel-topic'>
                  <TextWithEmoji
                    content={props.channel.description?.split('\n').shift()}
                  />
                </Typography>
              </OverflowingText>
            </DescriptionLink>
          </Show>
        </Match>
        <Match when={props.channel.type === 'DirectMessage'}>
          <HeaderIcon>
            <BiRegularAt size={24} />
          </HeaderIcon>
          <TextWithEmoji content={props.channel.recipient?.username} />
          <UserStatus status={props.channel.recipient?.presence} size='8px' />
        </Match>
        <Match when={props.channel.type === 'SavedMessages'}>
          <HeaderIcon>
            <BiSolidNotepad size={24} />
          </HeaderIcon>
          {t('app.navigation.tabs.saved')}
        </Match>
      </Switch>

      <Spacer />

      <Show
        when={
          props.channel.type === 'Group' ||
          props.channel.orPermission('ManageChannel', 'ManagePermissions')
        }
      >
        <Button variant='plain' size='fluid' onPress={openChannelSettings}>
          <BiSolidCog size={24} />
        </Button>
      </Show>

      <Button
        variant='plain'
        size='fluid'
        onPress={() =>
          state.layout.toggleSectionState(LAYOUT_SECTIONS.MEMBER_SIDEBAR, true)
        }
      >
        <BiSolidGroup size={24} />
      </Button>
    </>
  );
}

/**
 * Vertical divider between name and topic
 */
const Divider = styled('div', 'Divider')`
  height: 20px;
  margin: 0px 5px;
  padding-left: 1px;
  background-color: var(--unset-bg);
`;

/**
 * Link for the description
 */
const DescriptionLink = styled.a`
  min-width: 0;
`;
