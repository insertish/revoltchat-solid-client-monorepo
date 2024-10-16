import MdLibraryAdd from '@material-design-icons/svg/outlined/library_add.svg?component-solid';
import { getController } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import type { Server } from 'revolt.js';
import { Show } from 'solid-js';

import { ContextMenu, ContextMenuButton } from './ContextMenu';

/**
 * Context menu for server sidebar
 */
export function ServerSidebarContextMenu(props: { server: Server }) {
  const t = useTranslation();

  /**
   * Create a new channel
   */
  function createChannel() {
    getController('modal').push({
      type: 'create_channel',
      server: props.server!,
    });
  }

  return (
    <ContextMenu>
      <Show when={props.server?.havePermission('ManageChannel')}>
        <ContextMenuButton icon={MdLibraryAdd} onClick={createChannel}>
          {t('app.context_menu.create_channel')}
        </ContextMenuButton>
      </Show>
    </ContextMenu>
  );
}
