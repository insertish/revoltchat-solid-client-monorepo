import type { Placement } from '@floating-ui/dom';
import type { Channel, Client, ServerMember, User } from 'revolt.js';
import type { Component, JSX } from 'solid-js';
import { createEffect } from 'solid-js';
import { useTheme } from 'solid-styled-components';
import { DirectiveProvider } from 'solid-styled-components';

import type { AutoCompleteState } from './directives';
import { autoComplete, floating, ripple, scrollable } from './directives';

export * from './components';
export { darkTheme } from './themes/darkTheme';
export type { DefaultTheme } from 'solid-styled-components';
export { styled, ThemeProvider, useTheme } from 'solid-styled-components';

/**
 * Generate SVG props to configure icon size
 * @param size Target size
 * @param viewBox Custom view box if necessary
 * @returns Props
 */
export function iconSize(size: string | number, viewBox?: string) {
  return {
    width: size,
    height: size,
    viewBox: viewBox ?? '0 0 24 24',
  };
}

/**
 * Provide directives
 */
export function ProvideDirectives(props: { children: JSX.Element }) {
  return (
    <DirectiveProvider
      directives={{
        'use:floating': floating,
        'use:scrollable': scrollable,
        'use:autoComplete': autoComplete,
        'use:ripple': ripple,
      }}
    >
      {props.children}
    </DirectiveProvider>
  );
}

/**
 * Apply theme to document body
 */
export function ApplyGlobalStyles() {
  const theme = useTheme();

  createEffect(() => {
    // Inject common theme styles
    Object.assign(document.body.style, {
      'font-family': theme.fonts.primary,
      background: theme.colours.background,
      color: theme.colours.foreground,
    });

    // Set default emoji size
    document.body.style.setProperty('--emoji-size', theme.layout.emoji.small);

    // Unset variables
    document.body.style.setProperty('--unset-fg', 'red');
    document.body.style.setProperty(
      '--unset-bg',
      'repeating-conic-gradient(red 0% 25%, transparent 0% 50%) 50% / 5px 5px'
    );

    // Inject all theme properties
    function recursivelyInject(key: string, obj: any) {
      if (typeof obj === 'object') {
        for (const subkey of Object.keys(obj)) {
          recursivelyInject(key + '-' + subkey, obj[subkey]);
        }
      } else {
        document.body.style.setProperty(`-${key}`, obj);
      }
    }

    recursivelyInject('', theme);
  });

  return <></>;
}
