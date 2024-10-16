import { autoUpdate, flip, offset, shift } from '@floating-ui/dom';
import { useFloating } from 'solid-floating-ui';
import {
  createSignal,
  For,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { Motion, Presence } from 'solid-motionone';

import type { FloatingElement } from '../../directives';
import { floatingElements } from '../../directives';
import { AutoComplete } from './AutoComplete';
import { TooltipBase } from './Tooltip';
import { UserCard } from './UserCard';

/**
 * Render the actual floating elements
 */
export function FloatingManager() {
  let mouseX = 0,
    mouseY = 0;

  /**
   * Keep track of last mouse position at all times
   */
  function onMouseMove({ clientX, clientY }: MouseEvent) {
    mouseX = clientX;
    mouseY = clientY;
  }

  onMount(() => document.addEventListener('mousemove', onMouseMove));
  onCleanup(() => document.addEventListener('mousemove', onMouseMove));

  return (
    <Portal mount={document.getElementById('floating')!}>
      <For each={floatingElements()}>
        {(element) => (
          <Presence>
            <Show when={element.show()}>
              <Floating {...element} mouseX={mouseX} mouseY={mouseY} />
            </Show>
          </Presence>
        )}
      </For>
    </Portal>
  );
}

/**
 * Render a floating element
 */
function Floating(props: FloatingElement & { mouseX: number; mouseY: number }) {
  const [floating, setFloating] = createSignal<HTMLDivElement>();

  /**
   * Figure out placement of the floating element
   */
  const placement = () => {
    const current = props.show();
    if (!current) return;

    if (current.tooltip) {
      return current.tooltip.placement;
    } else if (current.userCard) {
      return 'right-start';
    } else if (current.contextMenu) {
      return 'right-start';
    } else if (current.autoComplete) {
      return 'top-start';
    }
  };

  /**
   * Determine element to provide
   */
  const element = () => {
    const current = props.show();

    if (current?.contextMenu) {
      return {
        /**
         * Determine client rectangle for virtual element
         */
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: props.mouseX,
            y: props.mouseY,
            left: props.mouseX,
            right: props.mouseX,
            top: props.mouseY,
            bottom: props.mouseY,
          };
        },
      };
    } else {
      return props.element;
    }
  };

  const position = useFloating(element, floating, {
    placement: placement(),
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted:
      props.show()?.tooltip || props.show()?.autoComplete
        ? autoUpdate
        : undefined,
  });

  /**
   * Handle page clicks outside of floating element
   * @param event Event
   */
  function onMouseDown(event: MouseEvent) {
    // Context menu should always dismiss on click
    // (for now...)
    if (props.show()?.contextMenu) {
      props.hide();
      return;
    }

    // Otherwise figure out if we clicked within element
    const parentEl = floating();

    let currentEl = event.target as HTMLElement | null;
    while (currentEl && currentEl !== parentEl) {
      currentEl = currentEl.parentElement;
    }

    if (currentEl === null) {
      props.hide();
    }
  }

  // We know what we're doing here...
  // eslint-disable-next-line solid/reactivity
  if (props.config().userCard || props.config().contextMenu) {
    onMount(() => document.addEventListener('mousedown', onMouseDown));
    onCleanup(() => document.removeEventListener('mousedown', onMouseDown));
  }

  return (
    // TODO: don't think this works?
    <Motion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1, easing: [0.87, 0, 0.13, 1] }}
    >
      <div
        ref={setFloating}
        style={{
          position: position.strategy,
          top: `${position.y ?? 0}px`,
          left: `${position.x ?? 0}px`,
          // TODO: use floating-element zIndex from theme
          'z-index': 10000,
        }}
      >
        <Switch>
          <Match when={props.show()?.tooltip}>
            <TooltipBase>
              {typeof props.show()!.tooltip!.content === 'function'
                ? (props.show()!.tooltip!.content as Function)({})
                : props.show()!.tooltip!.content}
            </TooltipBase>
          </Match>
          <Match when={props.show()?.userCard}>
            <UserCard
              user={props.show()!.userCard!.user}
              member={props.show()!.userCard!.member}
            />
          </Match>
          <Match when={props.show()?.contextMenu}>
            {props.show()!.contextMenu!({})}
          </Match>
          <Match when={props.show()?.autoComplete}>
            <AutoComplete {...props.show()!.autoComplete!} />
          </Match>
        </Switch>
      </div>
    </Motion>
  );
}
