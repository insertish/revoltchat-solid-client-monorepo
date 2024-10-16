import type { JSX } from 'solid-js';
import { styled } from 'styled-system/jsx';

const Codeblock = styled('pre', {
  base: {
    color: '#c9d1d9',
    background: '#0d1117',

    padding: 'var(--gap-md)',
    borderRadius: 'var(--borderRadius-md)',

    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',

    '&> code': {
      color: 'inherit !important',
      background: 'transparent !important',
    },
  },
});

/**
 * Render a code block with copy text button
 */
export function RenderCodeblock(props: {
  children: JSX.Element;
  class?: string;
}) {
  return <Codeblock>{props.children}</Codeblock>;
}
