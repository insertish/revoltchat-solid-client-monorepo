import { useUser } from '@revolt/client';
import { getController } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import { TextWithEmoji } from '@revolt/markdown';
import { ColouredText, useTheme } from '@revolt/ui';
import type { Server } from 'revolt.js';
import {
  BiSolidEnvelope,
  BiSolidFlagAlt,
  BiSolidGroup,
  BiSolidHappyBeaming,
  BiSolidInfoCircle,
  BiSolidTrash,
  BiSolidUserX,
} from 'solid-icons/bi';

import type { SettingsConfiguration } from '..';
import Overview from './Overview';

const Config: SettingsConfiguration<Server> = {
  /**
   * Page titles
   * @param key
   */
  title(key) {
    const t = useTranslation();
    return t(
      `app.settings.server_pages.${key.replaceAll('/', '.')}.title`,
      undefined,
      key
    );
  },

  /**
   * Render the current server settings page
   */
  render(props, server) {
    const id = props.page();

    if (!server.$exists) {
      getController('modal').pop();
      return null;
    }

    switch (id) {
      case 'overview':
        return <Overview server={server} />;
      default:
        return null;
    }
  },

  /**
   * Generate list of categories / entries for server settings
   * @returns List
   */
  list(server) {
    const t = useTranslation();
    const theme = useTheme();
    const user = useUser();

    return {
      entries: [
        {
          title: <TextWithEmoji content={server.name} />,
          entries: [
            {
              id: 'overview',
              icon: <BiSolidInfoCircle size={20} />,
              title: t('app.settings.server_pages.overview.title'),
            },
            {
              id: 'members',
              icon: <BiSolidGroup size={20} />,
              title: t('app.settings.server_pages.members.title'),
            },
            /*{ TODO: deprecate
            id: "categories",
            icon: <BiRegularListUl size={20} />,
            title: t("app.settings.server_pages.categories.title"),
          },*/
            {
              hidden: !(
                server.havePermission('ManageRole') ||
                server.havePermission('AssignRoles')
              ),
              id: 'roles',
              icon: <BiSolidFlagAlt size={20} />,
              title: t('app.settings.server_pages.roles.title'),
            },
          ],
        },
        {
          hidden: !server.havePermission('ManageCustomisation'),
          title: t('app.settings.server_pages.customisation.title'),
          entries: [
            {
              id: 'emojis',
              icon: <BiSolidHappyBeaming size={20} />,
              title: t('app.settings.server_pages.emojis.title'),
            },
          ],
        },
        {
          hidden:
            !server.havePermission('ManageServer') &&
            !server.havePermission('BanMembers'),
          title: t('app.settings.server_pages.management.title'),
          entries: [
            {
              hidden: !server.havePermission('ManageServer'),
              id: 'invites',
              icon: <BiSolidEnvelope size={20} />,
              title: t('app.settings.server_pages.invites.title'),
            },
            {
              hidden: !server.havePermission('BanMembers'),
              id: 'bans',
              icon: <BiSolidUserX size={20} />,
              title: t('app.settings.server_pages.bans.title'),
            },
          ],
        },
        {
          hidden: !(server.ownerId === user()?.id),
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
                  {t('app.context_menu.delete_server')}
                </ColouredText>
              ),
              /**
               * Handle server deletion request
               */
              onClick() {
                getController('modal').push({
                  type: 'delete_server',
                  server,
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

export interface ServerSettingsProps {
  /**
   * Server
   */
  server: Server;
}
