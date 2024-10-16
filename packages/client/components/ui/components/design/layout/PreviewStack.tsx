import type { Accessor, JSX } from 'solid-js';
import { For, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props<T> {
  /**
   * Items to display with degrees
   */
  items: [T, number][];

  /**
   * Render each child
   * @param item Item
   * @returns Element
   */
  children: (item: T) => JSX.Element;

  /**
   * Animate the stack to closure
   */
  hideStack?: Accessor<boolean>;

  /**
   * Additional elements to display on the stack
   */
  overlay?: JSX.Element;
}

/**
 * Preview stack layout component
 */
export function PreviewStack<T>(props: Props<T>) {
  return (
    <Base hideStack={props.hideStack?.() ?? false}>
      <For each={props.items}>
        {(item) => <StackElement item={item} children={props.children} />}
      </For>
      <Overlay>{props.overlay}</Overlay>
    </Base>
  );
}

/**
 * Individual layered element
 */
function StackElement<T>(props: {
  item: [T, number];
  children: (item: T) => JSX.Element;
}) {
  let ref: HTMLDivElement | undefined;

  onMount(() =>
    setTimeout(() => {
      if (ref) {
        ref.style.transform = `translate(-50%, -50%) rotate(${props.item[1]}deg) translate(0, -30px)`;
      }
    })
  );

  return <Child ref={ref}>{props.children(props.item[0])}</Child>;
}

/**
 * Element centre positioning
 */
const Overlay = styled.div`
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
`;

/**
 * Default transform used for children
 */
const DEFAULT_TRANSFORM = 'translate(-50%, -50%) scale(0.001)';

/**
 * Dynamic child positioning
 */
const Child = styled(Overlay)`
  opacity: 0.9;
  transform: ${DEFAULT_TRANSFORM};
  transition: ${(props) => props.theme!.transitions.fast} all;
`;

/**
 * Container element to provide position reference
 */
const Base = styled.div<{ hideStack: boolean }>`
  position: relative;
  margin: auto;
  background: gray;

  ${(props) =>
    props.hideStack
      ? `> * { transform: ${DEFAULT_TRANSFORM} !important; }`
      : ''}
`;
