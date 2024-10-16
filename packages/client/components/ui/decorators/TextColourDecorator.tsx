import type { JSX } from 'solid-js';

/**
 * Set text colour to white for content
 */
export default function TextColourDecorator(props: { children: JSX.Element }) {
  return <div style={{ color: 'white' }}>{props.children}</div>;
}
