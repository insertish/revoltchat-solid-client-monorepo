import type { JSX } from 'solid-js';

/**
 * Create fit-content container around some content
 */
export default function FitContentDecorator(props: { children: JSX.Element }) {
  return <div style={{ width: 'fit-content' }}>{props.children}</div>;
}
