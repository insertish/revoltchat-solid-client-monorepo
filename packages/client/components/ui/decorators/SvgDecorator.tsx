import type { JSX } from 'solid-js';

/**
 * Create SVG container around some content
 */
export default function makeSvgDecorator(viewSize: number, domSize: number) {
  return (props: { children: JSX.Element }) => (
    <svg
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      width={domSize}
      height={domSize}
    >
      {props.children}
    </svg>
  );
}
