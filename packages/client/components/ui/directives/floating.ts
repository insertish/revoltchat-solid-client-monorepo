import { type Accessor, createSignal, type JSX, onCleanup } from 'solid-js';

type Props = JSX.Directives['floating'] & object;

export interface FloatingElement {
  config: () => Props;
  element: HTMLElement;
  hide: () => void;
  show: Accessor<Props | undefined>;
}

const [floatingElements, setFloatingElements] = createSignal<FloatingElement[]>(
  []
);

export { floatingElements };

/**
 * Register a new floating element
 * @param element element
 */
export function registerFloatingElement(element: FloatingElement) {
  setFloatingElements((elements) => [...elements, element]);
}

/**
 * Un register floating element
 * @param element DOM Element
 */
export function unregisterFloatingElement(element: HTMLElement) {
  setFloatingElements((elements) =>
    elements.filter((entry) => entry.element !== element)
  );
}

/**
 * Add floating elements
 * @param element Element
 * @param accessor Parameters
 */
export function floating(element: HTMLElement, accessor: Accessor<Props>) {
  const config = accessor();
  if (!config) return;

  const [show, setShow] = createSignal<Props | undefined>();

  registerFloatingElement({
    config: accessor,
    element,
    show,
    /**
     * Hide the element
     */
    hide() {
      setShow(undefined);
    },
  });

  /**
   * Trigger a floating element
   */
  function trigger(target: keyof Props, desiredState?: boolean) {
    const current = show();
    const config = accessor();

    if (target === 'userCard' && config.userCard) {
      if (current?.userCard) {
        setShow(undefined);
      } else if (!current) {
        setShow({ userCard: config.userCard });
      } else {
        setShow(undefined);
        setShow({ userCard: config.userCard });
      }
    }

    if (target === 'tooltip' && config.tooltip) {
      if (current?.tooltip) {
        if (desiredState !== true) {
          setShow(undefined);
        }
      } else if (!current) {
        if (desiredState !== false) {
          setShow({ tooltip: config.tooltip });
        }
      }
    }

    if (target === 'contextMenu' && config.contextMenu) {
      if (current?.contextMenu) {
        setShow(undefined);
      } else if (!current) {
        setShow({ contextMenu: config.contextMenu });
      } else {
        setShow(undefined);
        setShow({ contextMenu: config.contextMenu });
      }
    }
  }

  /**
   * Handle click events
   */
  function onClick() {
    // TODO: handle shift+click for mention
    trigger('userCard');
  }

  /**
   * Handle context menu click
   */
  function onContextMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    trigger('contextMenu');
  }

  /**
   * Handle mouse entering
   */
  function onMouseEnter() {
    trigger('tooltip', true);
  }

  /**
   * Handle mouse leaving
   */
  function onMouseLeave() {
    trigger('tooltip', false);
  }

  if (config.userCard) {
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    element.addEventListener('click', onClick);
  }

  if (config.tooltip) {
    element.ariaLabel =
      typeof config.tooltip.content === 'string'
        ? config.tooltip.content
        : config.tooltip!.aria!;

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
  }

  if (config.contextMenu) {
    element.addEventListener('contextmenu', onContextMenu);
    // TODO: iOS events for touch
  }

  onCleanup(() => {
    unregisterFloatingElement(element);

    if (config.userCard) {
      element.removeEventListener('click', onClick);
    }

    if (config.tooltip) {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
    }

    if (config.contextMenu) {
      element.removeEventListener('contextmenu', onContextMenu);
    }
  });
}
