import type { AriaButtonProps } from '@solid-aria/button';
import { createButton } from '@solid-aria/button';
import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { cva } from 'styled-system/css/cva';

const button = cva({
  base: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    fontWeight: 500,
    fontFamily: 'inherit',

    cursor: 'pointer',
    border: 'none',
    borderRadius: 'var(--borderRadius-xxl)',
    transition: 'var(--transitions-fast) all',

    // "&:hover": {
    //   filter: "brightness(1.2)",
    // },

    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      success: {
        fill: 'var(--customColours-success-onColor)',
        color: 'var(--customColours-success-onColor)',
        background: 'var(--customColours-success-color)',
      },
      warning: {
        fill: 'var(--customColours-warning-onColor)',
        color: 'var(--customColours-warning-onColor)',
        background: 'var(--customColours-warning-color)',
      },
      error: {
        fill: 'var(--customColours-error-onColor)',
        color: 'var(--customColours-error-onColor)',
        background: 'var(--customColours-error-color)',
      },
      primary: {
        fill: 'var(--colours-component-btn-foreground-primary)',
        color: 'var(--colours-component-btn-foreground-primary)',
        background: 'var(--colours-component-btn-background-primary)',
      },
      secondary: {
        fill: 'var(--colours-component-btn-foreground-secondary)',
        color: 'var(--colours-component-btn-foreground-secondary)',
        background: 'var(--colours-component-btn-background-secondary)',
      },
      plain: {
        fill: 'var(--colours-component-btn-foreground-plain)',
        color: 'var(--colours-component-btn-foreground-plain)',

        '&:hover': {
          textDecoration: 'underline',
        },

        '&:disabled': {
          textDecoration: 'none',
        },
      },
    },
    size: {
      normal: {
        height: '38px',
        minWidth: '96px',
        padding: '2px 16px',
        fontSize: '0.8125rem',
      },
      // compact: {
      //   minWidth: "96px",
      //   fontSize: "0.8125rem",
      //   height: "32px",
      //   padding: "2px 12px",
      // },
      icon: {
        width: '38px',
        height: '38px',
      },
      fab: {
        width: '42px',
        height: '42px',
        borderRadius: 'var(--borderRadius-xl)',
      },
      fluid: {
        borderRadius: 'var(--borderRadius-md)',
      },
    },
  },
  defaultVariants: {
    size: 'normal',
    variant: 'primary',
  },
});

export function Button(
  props: Omit<
    Parameters<typeof button>[0] & AriaButtonProps & JSX.DirectiveAttributes,
    'onClick'
  >
) {
  const [style, rest] = splitProps(props, ['size', 'variant']);
  let ref: HTMLButtonElement | undefined;

  const { buttonProps } = createButton(rest, () => ref);
  return (
    <button
      {...buttonProps}
      ref={ref}
      class={button(style)}
      // @codegen directives props=rest include=floating
    >
      {rest.children}
    </button>
  );
}
