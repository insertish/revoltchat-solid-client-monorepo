import MdBrush from '@material-design-icons/svg/outlined/brush.svg?component-solid';
import MdLanguage from '@material-design-icons/svg/outlined/language.svg?component-solid';
import MdPalette from '@material-design-icons/svg/outlined/palette.svg?component-solid';
import { useTranslation } from '@revolt/i18n';
import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  Column,
  FormGroup,
  iconSize,
  Time,
} from '@revolt/ui';

/**
 * Sync Configuration Page
 */
export default function Sync() {
  const t = useTranslation();

  return (
    <Column gap='lg'>
      <CategoryButtonGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdPalette {...iconSize(22)} />}
            description={t('app.settings.pages.sync.descriptions.appearance')}
          >
            {t('app.settings.pages.appearance.title')}
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdBrush {...iconSize(22)} />}
            description={t('app.settings.pages.sync.descriptions.theme')}
          >
            {t('app.settings.pages.appearance.theme')}
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdLanguage {...iconSize(22)} />}
            description={t('app.settings.pages.sync.descriptions.locale')}
          >
            {t('app.settings.pages.language.title')}
          </CategoryButton>
        </FormGroup>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <CategoryButton>
          Last sync <Time format='relative' value={0} />
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}
