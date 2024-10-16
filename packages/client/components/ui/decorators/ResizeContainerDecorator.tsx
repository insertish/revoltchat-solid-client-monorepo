import type { JSX } from 'solid-js';

/**
 * Create resize container around some content
 */
export default function ResizeContentDecorator(props: {
  children: JSX.Element;
}) {
  return (
    <div
      style={{
        width: '460px',
        height: '640px',
        display: 'flex',
        'flex-direction': 'column',
        resize: 'both',
        overflow: 'hidden',
      }}
    >
      {props.children}
    </div>
  );
}
