import MdLink from '@material-design-icons/svg/outlined/link.svg?component-solid';
import MdPersonAdd from '@material-design-icons/svg/outlined/person_add.svg?component-solid';
import MdPublic from '@material-design-icons/svg/outlined/public.svg?component-solid';
import MdToken from '@material-design-icons/svg/outlined/token.svg?component-solid';
import { useClient } from '@revolt/client';
import { createProfileResource } from '@revolt/client/resources';
import {
  CategoryButton,
  CategoryButtonGroup,
  Column,
  iconSize,
} from '@revolt/ui';

import { useSettingsNavigation } from '../../Settings';
import { UserSummary } from '../account/index';
import { EditProfileButtons } from '../profile/EditProfileButtons';

/**
 * View a specific bot
 */
export function ViewBot() {
  const client = useClient();
  const { page } = useSettingsNavigation();

  const bot = () => client().bots.get(page()!.substring('bots/'.length))!;
  const profile = createProfileResource(bot().user!);

  return (
    <Column gap='lg'>
      <UserSummary
        user={bot().user!}
        showBadges
        bannerUrl={profile.data?.animatedBannerURL}
      />
      <EditProfileButtons user={bot().user!} />
      {/* <ErrorBoundary fallback={<>Failed to load profile</>}>
        <Suspense fallback={<>loading...</>}>{profile.data?.content}</Suspense>
      </ErrorBoundary> */}

      <CategoryButtonGroup>
        <CategoryButton
          description='Generate a new token if it gets lost or compromised'
          icon={<MdToken {...iconSize(22)} />}
          action='chevron'
        >
          Reset Token
        </CategoryButton>
        <CategoryButton
          description='Allow others to add your bot to their servers from Discover'
          icon={<MdPublic {...iconSize(22)} />}
          action='chevron'
        >
          Submit to Discover
        </CategoryButton>
      </CategoryButtonGroup>

      <CategoryButtonGroup>
        <CategoryButton icon={<MdLink {...iconSize(22)} />} action='copy'>
          Copy Invite
        </CategoryButton>
        <CategoryButton
          icon={<MdPersonAdd {...iconSize(22)} />}
          action='chevron'
        >
          Invite Bot
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}
