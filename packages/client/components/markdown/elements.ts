import { cva } from 'styled-system/css';
import { styled } from 'styled-system/jsx';
import type { SystemStyleObject } from 'styled-system/types';

const inlineCodeStyles: SystemStyleObject = {
  flexShrink: 0,
  padding: '1px 4px',
  borderRadius: 'var(--borderRadius-md)',

  color: 'var(--colours-messaging-component-code-block-foreground)',
  background: 'var(--colours-messaging-component-code-block-background)',
};

export const paragraph = styled('p', {
  base: {
    '&>code': inlineCodeStyles,
  },
  variants: {
    emojiSize: {
      small: {
        '--emoji-size': 'var(--layout-emoji-small)',
      },
      medium: {
        '--emoji-size': 'var(--layout-emoji-medium)',
      },
      large: {
        '--emoji-size': 'var(--layout-emoji-large)',
      },
    },
  },
});

export const emphasis = styled('em', {
  base: {
    fontStyle: 'italic',
  },
});

export const heading1 = styled('h1', {
  base: {
    fontSize: '2em',
    fontWeight: 600,
  },
});

export const heading2 = styled('h2', {
  base: {
    fontSize: '1.6em',
    fontWeight: 600,
  },
});

export const heading3 = styled('h3', {
  base: {
    fontSize: '1.4em',
    fontWeight: 600,
  },
});

export const heading4 = styled('h4', {
  base: {
    fontSize: '1.2em',
    fontWeight: 600,
  },
});

export const heading5 = styled('h5', {
  base: {
    fontSize: '1em',
    fontWeight: 600,
  },
});

export const heading6 = styled('h6', {
  base: {
    fontSize: '0.8em',
    fontWeight: 600,
  },
});

export const listItem = styled('li', {
  base: {},
});

export const unorderedList = styled('ul', {
  base: {
    listStylePosition: 'outside',
    paddingLeft: '1.5em',

    '& li': {
      listStyleType: 'disc',
    },

    '& li li': {
      listStyleType: 'circle',
    },
  },
});

export const orderedList = styled('ol', {
  base: {
    listStylePosition: 'outside',
    paddingLeft: '1.5em',

    listStyleType: 'decimal',
  },
});

export const blockquote = styled('blockquote', {
  base: {
    margin: 'var(--gap-sm) 0',
    padding: 'var(--gap-sm) var(--gap-md)',
    borderRadius: 'var(--borderRadius-md)',
    color: 'var(--colours-messaging-component-blockquote-foreground)',
    background: 'var(--colours-messaging-component-blockquote-background)',
    borderInlineStart:
      'var(--gap-sm) solid var(--colours-messaging-component-blockquote-foreground)',
  },
});

export const table = styled('table', {
  base: {
    borderCollapse: 'collapse',
  },
});

export const tableHeader = styled('th', {
  base: {
    fontWeight: 600,
    padding: 'var(--gap-sm)',
    border: '1px solid var(--colours-foreground)',
  },
});

export const tableElement = styled('td', {
  base: {
    padding: 'var(--gap-sm)',
    border: '1px solid var(--colours-foreground)',
  },
});

export const code = styled('code', {
  base: {
    fontFamily: 'var(--fonts-monospace)',
  },
});

export const time = cva({
  base: inlineCodeStyles,
});
