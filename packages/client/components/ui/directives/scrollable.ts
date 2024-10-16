import { type Accessor, type JSX, onCleanup } from 'solid-js';
import { css, useTheme } from 'solid-styled-components';

/**
 * Add styles and events for a scrollable container
 * @param el Element
 * @param accessor Parameters
 */
export function scrollable(
  el: HTMLDivElement,
  accessor: Accessor<JSX.Directives['scrollable'] & object>
) {
  const props = accessor();
  if (!props) return;

  const theme = useTheme();

  el.classList.add(css`
    will-change: transform;
    ${props.offsetTop ? 'padding-top: ' + props.offsetTop + 'px;' : ''}
    ${'overflow-' + (props?.direction ?? 'y')}: scroll;
    ${'overflow-' + ((props?.direction ?? 'y') === 'y' ? 'x' : 'y')}: hidden;

    scrollbar-width: ${props?.showOnHover ? 'none' : 'initial'};
    scrollbar-color: ${props.foreground ??
      theme!.colours['component-scrollbar-foreground']}
      ${props.background ?? theme!.colours['component-scrollbar-background']};

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      ${props?.showOnHover ? 'display: none;' : ''}
    }

    &::-webkit-scrollbar-track {
      background: ${props.background ??
      theme!.colours['component-scrollbar-background']};
    }

    &::-webkit-scrollbar-thumb {
      background: ${props.foreground ??
      theme!.colours['component-scrollbar-foreground']};
      background-clip: content-box;

      border: 1px solid transparent;
      border-radius: ${theme!.borderRadius.lg};
      border-top: ${(props?.offsetTop || 0).toString()}px solid transparent;
    }
  `);

  if (props.class) {
    props.class.split(' ').forEach((cls) => el.classList.add(cls));
  }

  if (props.showOnHover) {
    const showClass = css`
      scrollbar-width: initial !important;

      &::-webkit-scrollbar {
        display: unset !important;
      }
    `;

    /**
     * Handle mouse entry
     */
    const onMouseEnter = () => {
      el.classList.add(showClass);
    };

    /**
     * Handle mouse leave
     */
    const onMouseLeave = () => {
      el.classList.remove(showClass);
    };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    onCleanup(() => {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    });
  }
}
