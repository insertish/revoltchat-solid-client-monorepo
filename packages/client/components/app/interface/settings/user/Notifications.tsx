import MdMarkUnreadChatAlt from '@material-design-icons/svg/outlined/mark_unread_chat_alt.svg?component-solid';
import MdNotifications from '@material-design-icons/svg/outlined/notifications.svg?component-solid';
import MdSpeaker from '@material-design-icons/svg/outlined/speaker.svg?component-solid';
import { useTranslation } from '@revolt/i18n';
import {
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Checkbox,
  FormGroup,
  iconSize,
} from '@revolt/ui';

/**
 * Notifications Page
 */
export default function Notifications() {
  const t = useTranslation();

  return (
    <CategoryButtonGroup>
      <FormGroup>
        <CategoryButton
          action={<Checkbox value onChange={(value) => void value} />}
          onClick={() => void 0}
          icon={<MdNotifications {...iconSize(22)} />}
          description={t(
            'app.settings.pages.notifications.descriptions.enable_desktop'
          )}
        >
          {t('app.settings.pages.notifications.enable_desktop')}
        </CategoryButton>
      </FormGroup>
      <FormGroup>
        <CategoryButton
          action={<Checkbox value onChange={(value) => void value} />}
          onClick={() => void 0}
          icon={<MdMarkUnreadChatAlt {...iconSize(22)} />}
          description={t(
            'app.settings.pages.notifications.descriptions.enable_push'
          )}
        >
          {t('app.settings.pages.notifications.enable_push')}
        </CategoryButton>
      </FormGroup>
      <CategoryCollapse
        title={t('app.settings.pages.notifications.sounds')}
        icon={<MdSpeaker {...iconSize(22)} />}
      >
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon='blank'
          >
            {t('app.settings.pages.notifications.sound.message')}
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox onChange={(value) => void value} />}
            onClick={() => void 0}
            icon='blank'
          >
            {t('app.settings.pages.notifications.sound.outbound')}
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon='blank'
          >
            {t('app.settings.pages.notifications.sound.call_join')}
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon='blank'
          >
            {t('app.settings.pages.notifications.sound.call_leave')}
          </CategoryButton>
        </FormGroup>
      </CategoryCollapse>
    </CategoryButtonGroup>
  );
}
