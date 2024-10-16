import MdBugReport from '@material-design-icons/svg/outlined/bug_report.svg?component-solid';
import MdExitToApp from '@material-design-icons/svg/outlined/exit_to_app.svg?component-solid';
import MdFormatListNumbered from '@material-design-icons/svg/outlined/format_list_numbered.svg?component-solid';
import MdStar from '@material-design-icons/svg/outlined/star_outline.svg?component-solid';
import MdViewKanban from '@material-design-icons/svg/outlined/view_kanban.svg?component-solid';
import { useTranslation } from '@revolt/i18n';
import {
  CategoryButton,
  CategoryButtonGroup,
  Column,
  iconSize,
  styled,
} from '@revolt/ui';

/**
 * Feedback
 */
export default function Feedback() {
  const t = useTranslation();

  return (
    <Column gap='lg'>
      <CategoryButtonGroup>
        <Link
          href='https://github.com/orgs/revoltchat/projects/6/views/4'
          target='_blank'
        >
          <CategoryButton
            action='external'
            icon={<MdViewKanban {...iconSize(22)} />}
            onClick={() => void 0}
            description="See what we're currently working on."
          >
            Roadmap
          </CategoryButton>
        </Link>
        <Link
          href='https://github.com/orgs/revoltchat/discussions'
          target='_blank'
        >
          <CategoryButton
            action='external'
            icon={<MdStar {...iconSize(22)} />}
            onClick={() => void 0}
            description={t('app.settings.pages.feedback.suggest_desc')}
          >
            {t('app.settings.pages.feedback.suggest')}
          </CategoryButton>
        </Link>
        <Link
          href='https://github.com/revoltchat/frontend/issues/new/choose'
          target='_blank'
        >
          <CategoryButton
            action='external'
            icon={<MdFormatListNumbered {...iconSize(22)} />}
            onClick={() => void 0}
            description={t('app.settings.pages.feedback.issue_desc')}
          >
            {t('app.settings.pages.feedback.issue')}
          </CategoryButton>
        </Link>
        <Link
          href='https://github.com/orgs/revoltchat/projects/3'
          target='_blank'
        >
          <CategoryButton
            action='external'
            icon={<MdBugReport {...iconSize(22)} />}
            onClick={() => void 0}
            description={t('app.settings.pages.feedback.bug_desc')}
          >
            {t('app.settings.pages.feedback.bug')}
          </CategoryButton>
        </Link>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <CategoryButton
          action='chevron'
          icon={<MdExitToApp {...iconSize(22)} />}
          onClick={() => void 0}
          description='You can report issues and discuss improvements with us directly here.'
        >
          Join the Revolt Lounge
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}

/**
 * Link without decorations
 */
const Link = styled.a`
  text-decoration: none;
`;
