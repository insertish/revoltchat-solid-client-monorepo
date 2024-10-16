import { useClient } from '@revolt/client';
import { getController } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import { TextWithEmoji } from '@revolt/markdown';
import { ColouredText, useTheme } from '@revolt/ui';
import type { Channel } from 'revolt.js';
import {
  BiRegularListUl,
  BiSolidCloud,
  BiSolidInfoCircle,
  BiSolidTrash,
} from 'solid-icons/bi';

import type { SettingsConfiguration } from '..';
import Webhooks, { Webhook } from './Webhooks';

const Config: SettingsConfiguration<Channel> = {
  /**
   * Page titles
   * @param key
   */
  title(key) {
    const t = useTranslation();
    const client = useClient();

    if (key.startsWith('webhooks/')) {
      const webhook = client().channelWebhooks.get(key.substring(9));
      return webhook!.name;
    }

    return t(`app.settings.channel_pages.${key.replaceAll('/', '.')}.title`);
  },

  /**
   * Render the current channel settings page
   */
  render(props, channel) {
    const id = props.page();
    const client = useClient();

    if (id?.startsWith('webhooks/')) {
      const webhook = client().channelWebhooks.get(id.substring(9));
      return <Webhook webhook={webhook!} />;
    }

    switch (id) {
      case 'webhooks':
        return <Webhooks channel={channel} />;
      default:
        return null;
    }
  },

  /**
   * Generate list of categories / entries for channel settings
   * @returns List
   */
  list(channel) {
    const t = useTranslation();
    const theme = useTheme();

    return {
      entries: [
        {
          title: <TextWithEmoji content={channel.name} />,
          entries: [
            {
              id: 'overview',
              icon: <BiSolidInfoCircle size={20} />,
              title: t('app.settings.channel_pages.overview.title'),
            },
            {
              hidden: !channel.havePermission('ManagePermissions'),
              id: 'permissions',
              icon: <BiRegularListUl size={20} />,
              title: t('app.settings.channel_pages.permissions.title'),
            },
            {
              hidden: !channel.havePermission('ManageWebhooks'),
              id: 'webhooks',
              icon: <BiSolidCloud size={20} />,
              title: t('app.settings.channel_pages.webhooks.title'),
            },
          ],
        },
        {
          hidden: !(
            channel.type !== 'Group' && channel.havePermission('ManageChannel')
          ),
          entries: [
            {
              icon: (
                <BiSolidTrash
                  size={20}
                  color={theme!.customColours.error.color}
                />
              ),
              title: (
                <ColouredText colour={theme!.customColours.error.color}>
                  {t('app.context_menu.delete_channel')}
                </ColouredText>
              ),
              /**
               * Handle server deletion request
               */
              onClick() {
                getController('modal').push({
                  type: 'delete_channel',
                  channel,
                });
              },
            },
          ],
        },
      ],
    };
  },
};

export default Config;

export interface ChannelSettingsProps {
  /**
   * Channel
   */
  channel: Channel;
}
