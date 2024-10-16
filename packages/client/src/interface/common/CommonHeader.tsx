import { Row } from '@revolt/ui';
import { BiRegularChevronLeft } from 'solid-icons/bi';
import type { JSX } from 'solid-js';

/**
 * Wrapper for header icons which adds the chevron on the
 * correct side for toggling sidebar (if on desktop) and
 * the hamburger icon to open sidebar (if on mobile).
 */
export function HeaderIcon(props: { children: JSX.Element }) {
  return (
    <Row gap='none' align>
      <BiRegularChevronLeft size={20} />
      {props.children}
    </Row>
  );
}
