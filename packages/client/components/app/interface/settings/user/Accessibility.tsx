import MdAnimation from '@material-design-icons/svg/outlined/animation.svg?component-solid';
import { useTranslation } from '@revolt/i18n';
import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  Column,
  FormGroup,
  iconSize,
} from '@revolt/ui';

/**
 * Accessibility settings page
 */
export default function Accessibility() {
  const t = useTranslation();

  return (
    <Column gap='lg'>
      <CategoryButtonGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdAnimation {...iconSize(22)} />}
            description={t(
              'app.settings.pages.accessibility.descriptions.reduced_motion'
            )}
          >
            {t('app.settings.pages.accessibility.reduced_motion')}
          </CategoryButton>
        </FormGroup>
      </CategoryButtonGroup>
    </Column>
  );
}
