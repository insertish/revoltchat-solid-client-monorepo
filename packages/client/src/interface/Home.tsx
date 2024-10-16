import MdAddCircle from '@material-design-icons/svg/filled/add_circle.svg?component-solid';
import MdExplore from '@material-design-icons/svg/filled/explore.svg?component-solid';
import MdGroups3 from '@material-design-icons/svg/filled/groups_3.svg?component-solid';
import MdHome from '@material-design-icons/svg/filled/home.svg?component-solid';
import MdPayments from '@material-design-icons/svg/filled/payments.svg?component-solid';
import MdRateReview from '@material-design-icons/svg/filled/rate_review.svg?component-solid';
import MdSettings from '@material-design-icons/svg/filled/settings.svg?component-solid';
import { IS_DEV, IS_REVOLT, useClient } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { modalController } from '@revolt/modal';
import { useNavigate } from '@revolt/routing';
import {
  Button,
  CategoryButton,
  Column,
  Header,
  iconSize,
  styled,
  Typography,
} from '@revolt/ui';
import { Match, Show, Switch } from 'solid-js';
import { cva } from 'styled-system/css';

//
// import RevoltSvg from "../../public/assets/wordmark_wide_500px.svg?component-solid";
import { HeaderIcon } from './common/CommonHeader';

const Logo = styled('div')`
  width: 240px;
  fill: ${(props) => props.theme!.colours['foreground']};
`;

/**
 * Base layout of the home page (i.e. the header/background)
 */
const Base = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/**
 * Layout of the content as a whole
 */
const content = cva({
  base: {
    minHeight: 0,
    width: '100%',
    margin: 'auto',
    padding: 'var(--gap-xxl) 0',

    display: 'flex',
    gap: 'var(--gap-xl)',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

/**
 * Layout of the buttons
 */
const Buttons = styled('div')`
  display: flex;

  padding: ${(props) => props.theme!.gap.md};

  border-radius: ${(props) => props.theme!.borderRadius.lg};
  background: ${(props) => props.theme!.colours['sidebar-channels-background']};
`;

/**
 * Make sure the columns are separated
 */
const SeparatedColumn = styled(Column)`
  justify-content: stretch;
  margin-inline: 0.25em;
  width: 260px;

  > * {
    flex-grow: 1;
  }
`;

/**
 * Make sure the image is separated from the welcome text
 */
const Image = styled('img')`
  margin-top: 0.5em;
  height: 36px;

  filter: ${(props) => props.theme!.effects.invert.black};
`;

/**
 * Home page
 */
export function HomePage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const client = useClient();

  // check if we're revolt.chat; if so, check if the user is in the Lounge
  const showLoungeButton = IS_REVOLT;
  const isInLounge =
    client()!.servers.get('01F7ZSBSFHQ8TA81725KQCSDDP') !== undefined;

  return (
    // TODO: i18n
    <Base>
      <Header placement='primary'>
        <HeaderIcon>
          <MdHome {...iconSize(22)} />
        </HeaderIcon>
        Home
      </Header>
      <div use:scrollable={{ class: content() }}>
        <Column>
          <Typography variant='home-page-title'>
            {t('app.special.modals.onboarding.welcome')}
          </Typography>
          <Logo />
        </Column>
        <Buttons>
          <SeparatedColumn>
            <CategoryButton
              onClick={() =>
                modalController.push({
                  type: 'create_group',
                  client: client()!,
                })
              }
              description={t('app.home.group_desc')}
              icon={<MdAddCircle />}
            >
              {t('app.home.group')}
            </CategoryButton>
            <Switch fallback={null}>
              <Match when={showLoungeButton && isInLounge}>
                <CategoryButton
                  onClick={() => navigate('/server/01F7ZSBSFHQ8TA81725KQCSDDP')}
                  description={t('app.home.goto-testers_desc')}
                  icon={<MdGroups3 />}
                >
                  {t('app.home.goto-testers')}
                </CategoryButton>
              </Match>
              <Match when={showLoungeButton && !isInLounge}>
                <CategoryButton
                  description={t('app.home.join-testers_desc')}
                  icon={<MdGroups3 />}
                >
                  {t('app.home.join-testers')}
                </CategoryButton>
              </Match>
            </Switch>
            <CategoryButton
              onClick={() =>
                window.open('https://insrt.uk/donate?utm_source=revoltapp')
              }
              description={t('app.home.donate_desc')}
              icon={<MdPayments />}
            >
              {t('app.home.donate')}
            </CategoryButton>
          </SeparatedColumn>
          <SeparatedColumn>
            <Show when={IS_REVOLT}>
              <CategoryButton
                onClick={() => navigate('/discover')}
                description={t('app.home.discover_desc')}
                icon={<MdExplore />}
              >
                {t('app.home.discover')}
              </CategoryButton>
            </Show>
            <CategoryButton
              description={t('app.home.feedback_desc')}
              icon={<MdRateReview {...iconSize(22)} />}
            >
              {t('app.home.feedback')}
            </CategoryButton>
            <CategoryButton
              onClick={() =>
                modalController.push({ type: 'settings', config: 'user' })
              }
              description={t('app.home.settings-tooltip')}
              icon={<MdSettings />}
            >
              {t('app.home.settings')}
            </CategoryButton>
          </SeparatedColumn>
        </Buttons>
        <Show when={IS_DEV}>
          <Button onPress={() => navigate('/dev')}>
            Open Development Page
          </Button>
        </Show>
      </div>
    </Base>
  );
}
