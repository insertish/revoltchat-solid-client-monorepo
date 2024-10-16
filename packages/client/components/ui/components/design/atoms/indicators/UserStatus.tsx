import type { API } from 'revolt.js';
import { useTheme } from 'solid-styled-components';

export interface Props {
  /**
   * User we are dealing with
   * @default Invisible
   */
  status?: API.Presence;
}

/**
 * Overlays user status in current SVG
 */
export const UserStatusGraphic = (props: Props) => {
  const theme = useTheme();

  /**
   * Convert status to lower case
   */
  const statusLowercase = () => props.status?.toLowerCase() ?? 'invisible';

  return (
    <circle
      cx='27'
      cy='27'
      r='5'
      fill={
        theme.customColours[`status-${statusLowercase() as 'online'}`].color
      }
      mask={`url(#accessible-status-${statusLowercase()})`}
    />
  );
};

/**
 * Stand-alone user status element
 */
export function UserStatus(props: Props & { size: string }) {
  return (
    <svg viewBox='22 22 10 10' height={props.size}>
      <UserStatusGraphic {...props} />
    </svg>
  );
}
