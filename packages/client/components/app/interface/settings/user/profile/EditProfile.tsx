import MdGroups from '@material-design-icons/svg/outlined/groups.svg?component-solid';
import { useClient } from '@revolt/client';
import { createOwnProfileResource } from '@revolt/client/resources';
import { modalController } from '@revolt/modal';
import {
  Avatar,
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Column,
  iconSize,
} from '@revolt/ui';
import { For } from 'solid-js';

import { UserSummary } from '../account/index';
import { EditProfileButtons } from './EditProfileButtons';

/**
 * Edit profile
 */
export function EditProfile() {
  const client = useClient();
  const profile = createOwnProfileResource();

  return (
    <Column gap='lg'>
      <UserSummary
        user={client().user!}
        bannerUrl={profile.data?.animatedBannerURL}
      />

      <EditProfileButtons user={client().user!} />

      <CategoryButtonGroup>
        <CategoryCollapse
          icon={<MdGroups {...iconSize(22)} />}
          title='Server Identities'
          description='Change your profile per-server'
          scrollable
        >
          <For each={client().servers.toList()}>
            {(server) => (
              <CategoryButton
                icon={
                  <Avatar
                    src={server.animatedIconURL}
                    size={24}
                    fallback={server.name}
                  />
                }
                onClick={() =>
                  modalController.push({
                    type: 'server_identity',
                    member: server.member!,
                  })
                }
              >
                {server.name}
              </CategoryButton>
            )}
          </For>
        </CategoryCollapse>
      </CategoryButtonGroup>
    </Column>
  );
}
