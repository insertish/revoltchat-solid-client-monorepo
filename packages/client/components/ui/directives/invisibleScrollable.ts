import type { Accessor, JSX } from 'solid-js';
import { css } from 'solid-styled-components';

/**
 * Add styles for an invisible scrollable container
 * @param el Element
 * @param accessor Parameters
 */
export function invisibleScrollable(
  el: HTMLDivElement,
  accessor: Accessor<JSX.Directives['invisibleScrollable'] & object>
) {
  const props = accessor();

  el.classList.add(css`
    will-change: transform;
    ${'overflow-' + (props?.direction ?? 'y')}: scroll;

    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  `);

  if (props.class) {
    props.class.split(' ').forEach((cls) => el.classList.add(cls));
  }
}
