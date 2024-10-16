import MdCakeFill from '@material-design-icons/svg/filled/cake.svg?component-solid';
import MdAlternateEmail from '@material-design-icons/svg/outlined/alternate_email.svg?component-solid';
import MdBlock from '@material-design-icons/svg/outlined/block.svg?component-solid';
import MdDelete from '@material-design-icons/svg/outlined/delete.svg?component-solid';
import MdDraw from '@material-design-icons/svg/outlined/draw.svg?component-solid';
import MdEdit from '@material-design-icons/svg/outlined/edit.svg?component-solid';
import MdLock from '@material-design-icons/svg/outlined/lock.svg?component-solid';
import MdMail from '@material-design-icons/svg/outlined/mail.svg?component-solid';
import MdPassword from '@material-design-icons/svg/outlined/password.svg?component-solid';
import MdVerifiedUser from '@material-design-icons/svg/outlined/verified_user.svg?component-solid';
import { clientController, useClient } from '@revolt/client';
import {
  createMfaResource,
  createOwnProfileResource,
} from '@revolt/client/resources';
import { getController } from '@revolt/common';
import { dayjs, useTranslation } from '@revolt/i18n';
import {
  Avatar,
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Column,
  iconSize,
  Row,
  styled,
  Typography,
  useTheme,
} from '@revolt/ui';
import {
  type Accessor,
  createMemo,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from 'solid-js';

import { useSettingsNavigation } from '../Settings';
import { UserSummary } from './account/index';

/**
 * Account Page
 */
export default function MyAccount() {
  const client = useClient();
  const profile = createOwnProfileResource();
  const { navigate } = useSettingsNavigation();

  return (
    <Column gap='lg'>
      <UserSummary
        user={client().user!}
        bannerUrl={profile.data?.animatedBannerURL}
        onEdit={() => navigate('profile')}
        showBadges
      />
      <EditAccount />
      <MultiFactorAuth />
      <ManageAccount />
    </Column>
  );
}

/**
 * Edit account details
 */
function EditAccount() {
  const t = useTranslation();
  const client = useClient();
  const [email, setEmail] = createSignal('•••••••••••@•••••••••••');

  return (
    <CategoryButtonGroup>
      <CategoryButton
        action='chevron'
        onClick={() =>
          getController('modal').push({
            type: 'edit_username',
            client: client(),
          })
        }
        icon={<MdAlternateEmail {...iconSize(22)} />}
        description={client().user?.username}
      >
        <Typography variant='label'>{t('login.username')}</Typography>
      </CategoryButton>
      <CategoryButton
        action='chevron'
        onClick={() =>
          getController('modal').push({
            type: 'edit_email',
            client: client(),
          })
        }
        icon={<MdMail {...iconSize(22)} />}
        description={
          <Row>
            {email()}{' '}
            <Show when={email().startsWith('•')}>
              <a
                onClick={(event) => {
                  event.stopPropagation();
                  client().account.fetchEmail().then(setEmail);
                }}
              >
                Reveal
              </a>
            </Show>
          </Row>
        }
      >
        <Typography variant='label'>{t('login.email')}</Typography>
      </CategoryButton>
      <CategoryButton
        action='chevron'
        onClick={() =>
          getController('modal').push({
            type: 'edit_password',
            client: client(),
          })
        }
        icon={<MdPassword {...iconSize(22)} />}
        description={'•••••••••'}
      >
        <Typography variant='label'>{t('login.password')}</Typography>
      </CategoryButton>
    </CategoryButtonGroup>
  );
}

/**
 * Multi-factor authentication
 */
function MultiFactorAuth() {
  const client = useClient();
  const mfa = createMfaResource();

  /**
   * Show recovery codes
   */
  async function showRecoveryCodes() {
    const modals = getController('modal');
    const ticket = await modals.mfaFlow(mfa.data!);

    ticket!.fetchRecoveryCodes().then((codes) =>
      getController('modal').push({
        type: 'mfa_recovery',
        mfa: mfa.data!,
        codes,
      })
    );
  }

  /**
   * Generate recovery codes
   */
  async function generateRecoveryCodes() {
    const modals = getController('modal');
    const ticket = await modals.mfaFlow(mfa.data!);

    ticket!.generateRecoveryCodes().then((codes) =>
      getController('modal').push({
        type: 'mfa_recovery',
        mfa: mfa.data!,
        codes,
      })
    );
  }

  /**
   * Configure authenticator app
   */
  async function setupAuthenticatorApp() {
    const modals = getController('modal');
    const ticket = await modals.mfaFlow(mfa.data!);
    const secret = await ticket!.generateAuthenticatorSecret();

    let success;
    while (!success) {
      try {
        const code = await modals.mfaEnableTOTP(
          secret,
          client().user!.username
        );

        if (code) {
          await mfa.data!.enableAuthenticator(code);
          success = true;
        }
      } catch (err) {
        /* no-op */
      }
    }
  }

  /**
   * Disable authenticator app
   */
  function disableAuthenticatorApp() {
    getController('modal')
      .mfaFlow(mfa.data!)
      .then((ticket) => ticket!.disableAuthenticator());
  }

  return (
    <CategoryButtonGroup>
      <CategoryCollapse
        icon={<MdVerifiedUser {...iconSize(22)} />}
        title='Recovery Codes'
        description='Configure a way to get back into your account in case your 2FA is lost'
      >
        <Switch
          fallback={
            <CategoryButton
              icon='blank'
              disabled={mfa.isLoading}
              onClick={generateRecoveryCodes}
              description='Setup recovery codes'
            >
              Generate Recovery Codes
            </CategoryButton>
          }
        >
          <Match when={!mfa.isLoading && mfa.data?.recoveryEnabled}>
            <CategoryButton
              icon='blank'
              description='Get active recovery codes'
              onClick={showRecoveryCodes}
            >
              View Recovery Codes
            </CategoryButton>
            <CategoryButton
              icon='blank'
              description='Get a new set of recovery codes'
              onClick={generateRecoveryCodes}
            >
              Reset Recovery Codes
            </CategoryButton>
          </Match>
        </Switch>
      </CategoryCollapse>
      <CategoryCollapse
        icon={<MdLock {...iconSize(22)} />}
        title='Authenticator App'
        description='Configure one-time password authentication'
      >
        <Switch
          fallback={
            <CategoryButton
              icon='blank'
              disabled={mfa.isLoading}
              onClick={setupAuthenticatorApp}
              description='Setup one-time password authenticator'
            >
              Enable Authenticator
            </CategoryButton>
          }
        >
          <Match when={!mfa.isLoading && mfa.data?.authenticatorEnabled}>
            <CategoryButton
              icon='blank'
              description='Disable one-time password authenticator'
              onClick={disableAuthenticatorApp}
            >
              Remove Authenticator
            </CategoryButton>
          </Match>
        </Switch>
      </CategoryCollapse>
    </CategoryButtonGroup>
  );
}

/**
 * Manage account
 */
function ManageAccount() {
  const theme = useTheme();
  const t = useTranslation();
  const client = useClient();
  const mfa = createMfaResource();

  const stillOwnServers = createMemo(
    () =>
      client().servers.filter((server) => server.owner?.self || false).length >
      0
  );

  /**
   * Disable account
   */
  function disableAccount() {
    getController('modal')
      .mfaFlow(mfa.data!)
      .then((ticket) =>
        ticket!.disableAccount().then(() => clientController.logout())
      );
  }

  /**
   * Delete account
   */
  function deleteAccount() {
    getController('modal')
      .mfaFlow(mfa.data!)
      .then((ticket) =>
        ticket!.deleteAccount().then(() => clientController.logout())
      );
  }

  return (
    <CategoryButtonGroup>
      <CategoryButton
        action='chevron'
        disabled={mfa.isLoading}
        onClick={disableAccount}
        icon={
          <MdBlock {...iconSize(22)} fill={theme!.customColours.error.color} />
        }
        description={t('app.settings.pages.account.manage.disable_description')}
      >
        {t('app.settings.pages.account.manage.disable')}
      </CategoryButton>
      <CategoryButton
        action={stillOwnServers() ? undefined : 'chevron'}
        disabled={mfa.isLoading || stillOwnServers()}
        onClick={deleteAccount}
        icon={
          <MdDelete {...iconSize(22)} fill={theme!.customColours.error.color} />
        }
        description={t('app.settings.pages.account.manage.delete_description')}
      >
        {t(
          stillOwnServers()
            ? 'app.settings.pages.account.manage.delete_still_own_servers'
            : 'app.settings.pages.account.manage.delete'
        )}
      </CategoryButton>
    </CategoryButtonGroup>
  );
}
