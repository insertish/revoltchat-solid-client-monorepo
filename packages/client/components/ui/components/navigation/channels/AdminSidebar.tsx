import { MenuButton } from '../../design';
import { Typography } from '../../design/atoms/display/Typography';
import { Column } from '../../design/layout';
import { SidebarBase } from './common';

interface Props {
  /**
   * Open a new tab of type with title
   * @param type Tab type
   * @param title Tab title
   */
  readonly openTab: (type: string, title: string) => void;
}

/**
 * Display home navigation and conversations
 */
export const AdminSidebar = (props: Props) => {
  return (
    <SidebarBase>
      <div use:scrollable>
        <Column>
          <p>
            <Typography variant='legacy-settings-title'>Admin Panel</Typography>
          </p>
          <a onClick={() => props.openTab('inspector', 'Inspector')}>
            <MenuButton attention='active'>Inspector</MenuButton>
          </a>
        </Column>
      </div>
    </SidebarBase>
  );
};
