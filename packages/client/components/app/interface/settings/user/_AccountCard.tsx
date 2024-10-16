import { useClient } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { Avatar, OverflowingText, Typography } from '@revolt/ui';

import {
  SidebarButton,
  SidebarButtonContent,
  SidebarButtonTitle,
} from '../_layout/SidebarButton';
// import MdError from "@material-design-icons/svg/filled/error.svg?component-solid";
import { useSettingsNavigation } from '../Settings';

/**
 * Account Card
 */
export function AccountCard() {
  const client = useClient();
  const t = useTranslation();
  const { page, navigate } = useSettingsNavigation();
  // const theme = useTheme();

  return (
    <SidebarButton
      onClick={() => navigate('account')}
      aria-selected={page() === 'account'}
    >
      <SidebarButtonTitle>
        <Avatar size={36} src={client().user!.animatedAvatarURL} />
        <SidebarButtonContent>
          <OverflowingText>
            <Typography variant='settings-account-card-title'>
              {client().user!.displayName}
            </Typography>
          </OverflowingText>
          <Typography variant='settings-account-card-subtitle'>
            {t('app.settings.pages.account.title')}
          </Typography>
        </SidebarButtonContent>
      </SidebarButtonTitle>
      {/*<SidebarButtonIcon>
        <MdError {...iconSize(20)} fill={theme!.colour("primary")} />
      </SidebarButtonIcon>*/}
    </SidebarButton>
  );
}
