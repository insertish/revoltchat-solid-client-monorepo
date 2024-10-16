import type { ColorGroup, Scheme } from '@material/material-color-utilities';
import {
  argbFromHex,
  Hct,
  hexFromArgb,
  themeFromSourceColor,
  TonalPalette,
} from '@material/material-color-utilities';
import type { DefaultTheme } from 'solid-styled-components';

/**
 * Convert a scheme to usable hex colours
 * @param scheme Scheme
 * @returns Hex Scheme
 */
function schemeToHex(scheme: Scheme) {
  const hexScheme = {} as Record<keyof Scheme, string>;
  const toneScheme = {} as Record<keyof Scheme, TonalPalette>;

  (
    Object.keys(
      Object.getOwnPropertyDescriptors(Object.getPrototypeOf(scheme))
    ) as (keyof Scheme)[]
  )
    .filter((key) => typeof scheme[key] === 'number')
    .forEach((key) => {
      const colour = Hct.fromInt(scheme[key] as number);
      hexScheme[key] = hexFromArgb(colour.toInt());
      toneScheme[key] = TonalPalette.fromInt(colour.toInt());
    });

  return {
    scheme: hexScheme,
    tones: toneScheme,
  };
}

function hexToRgb(v: string) {
  const [_, r, g, b] = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i.exec(v)!;
  return `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`;
}

/**
 * Create dark theme
 */
export const darkTheme: (
  accentColour?: string,
  darkMode?: boolean
) => DefaultTheme = (accentColour = '#FF5733', darkMode = false) => {
  // const hex = "#d59ff5";
  // const hex = "#FF7F50";
  // const hex = "#B4CBAF"; // Green
  // const hex = "#8C5FD3"; // Purple
  // const accentColour = "#FF5733"; // Coral Orange
  // const darkMode = false;
  const theme = themeFromSourceColor(argbFromHex(accentColour), [
    {
      name: 'success',
      value: argbFromHex('#65E572'),
      blend: true,
    },
    {
      name: 'warning',
      value: argbFromHex('#FAA352'),
      blend: true,
    },
    {
      name: 'error',
      value: argbFromHex('#FF3322'),
      blend: true,
    },
  ]);

  const customColours = {
    'status-online': {
      color: '#3ABF7E',
      onColor: 'black',
    },
    'status-idle': {
      color: '#F39F00',
      onColor: 'black',
    },
    'status-focus': {
      color: '#4799F0',
      onColor: 'black',
    },
    'status-busy': {
      color: '#F84848',
      onColor: 'white',
    },
    'status-invisible': {
      color: '#A5A5A5',
      onColor: 'black',
    },
  } as Record<
    | `status-${
        | 'online'
        | 'idle'
        | 'focus'
        | 'busy'
        | 'streaming'
        | 'invisible'}`
    | 'success'
    | 'warning'
    | 'error',
    Record<keyof ColorGroup, string>
  >;

  for (const c of theme.customColors) {
    const output: Record<string, string> = {};
    const source = c[darkMode ? 'dark' : 'light'] as unknown as Record<
      string,
      number
    >;

    Object.keys(source).forEach(
      (key) => (output[key] = hexFromArgb(source[key]))
    );

    (customColours as Record<string, Record<keyof ColorGroup, string>>)[
      c.color.name
    ] = output as Record<keyof ColorGroup, string>;
  }

  const materialTheme = schemeToHex(theme.schemes[darkMode ? 'dark' : 'light']);

  function materialColour(base: keyof Scheme, tone?: number) {
    return tone
      ? hexFromArgb(
          materialTheme.tones[base].getHct(darkMode ? 100 - tone : tone).toInt()
        )
      : materialTheme.scheme[base];
  }

  return {
    darkMode,
    colours: {
      // Global
      background: materialColour('background'),
      foreground: materialColour('onBackground'),
      // Component: Button
      'component-btn-background-primary': materialColour('primary'),
      'component-btn-foreground-primary': materialColour('onBackground', 98),
      'component-btn-background-secondary': materialColour('surfaceVariant'),
      'component-btn-foreground-secondary': materialColour(
        'onSurfaceVariant',
        30
      ),
      'component-btn-foreground-plain': materialColour('onBackground'),
      'component-btn-foreground-plain-secondary': materialColour(
        'onBackground',
        40
      ),
      // Component: Menu Button
      'component-menubtn-default-background': 'transparent',
      'component-menubtn-default-foreground': materialColour(
        'onSurfaceVariant',
        55
      ),
      'component-menubtn-selected-background': materialColour('surfaceVariant'),
      'component-menubtn-selected-foreground': materialColour(
        'onSurfaceVariant',
        30
      ),
      'component-menubtn-muted-background': 'transparent',
      'component-menubtn-muted-foreground': materialColour(
        'onSurfaceVariant',
        45
      ),
      'component-menubtn-hover-background': materialColour('surfaceVariant'), // DEPRECATE
      'component-menubtn-hover-foreground': materialColour(
        // DEPRECATE
        'onSurfaceVariant',
        25
      ),
      // Component: Input
      'component-input-focus': materialColour('primary'),
      'component-input-foreground': materialColour('onBackground'),
      'component-input-background-primary': materialColour('background', 100),
      'component-input-background-secondary': materialColour('background', 98),
      'component-input-hover-primary': materialColour('background', 98), // DEPRECATE?
      'component-input-hover-secondary': materialColour('background', 100), // DEPRECATE?
      // Component: Chip
      'component-chip-background': materialColour('secondary', 96),
      // Component: Checkbox
      'component-checkbox-background': materialColour('primary', 92),
      'component-checkbox-foreground': materialColour('primary'),
      'component-checkbox-foreground-check': materialColour('onPrimary'),
      // Component: FAB
      'component-fab-background': materialColour('primary'),
      'component-fab-foreground': materialColour('primary', 90),
      // Component: Scrollbar
      'component-scrollbar-background': 'transparent',
      'component-scrollbar-foreground': materialColour('primary', 85),
      // Component: Category Button
      'component-categorybtn-background': materialColour('background', 99),
      'component-categorybtn-background-icon': materialColour('primary', 90),
      'component-categorybtn-background-collapse': materialColour(
        'background',
        97
      ),
      'component-categorybtn-background-hover': materialColour(
        'background',
        100
      ),
      'component-categorybtn-background-active': materialColour(
        'background',
        94
      ),
      'component-categorybtn-foreground': materialColour('onBackground', 10),
      'component-categorybtn-foreground-description': materialColour(
        'onBackground',
        30
      ),
      // Component: Modal
      'component-modal-background': materialColour('secondary', 96),
      'component-modal-foreground': materialColour('onBackground'),
      // Component: Avatar (Fallback)
      'component-avatar-fallback-background': materialColour(
        'onBackground',
        94
      ),
      'component-avatar-fallback-foreground': materialColour('onBackground'),
      'component-avatar-fallback-contrast-background':
        materialColour('primary'),
      'component-avatar-fallback-contrast-foreground':
        materialColour('onPrimary'),
      // Component: Context Menu
      'component-context-menu-background': materialColour('surfaceVariant', 97),
      'component-context-menu-foreground': materialColour('onSurface'),
      'component-context-menu-item-hover-background': materialColour(
        'surfaceVariant',
        92
      ),
      'component-context-menu-divider': materialColour('onSurface', 92),
      'component-context-menu-shadow': '#0004',
      // Component: Key
      'component-key-background': materialColour('secondary'),
      'component-key-foreground': materialColour('onSecondary'),
      // Component: Combo Box
      'component-combo-focus': materialColour('primary'),
      'component-combo-foreground': materialColour('onBackground'),
      'component-combo-background': materialColour('background', 100),
      // Component: Preloader
      'preloader-foreground': materialColour('primary'),

      // Sidebar
      // TODO: figure this out
      // works better for both dark and light theme but more muted:
      'sidebar-channels-background': materialColour('onBackground', 94),
      'sidebar-channels-foreground': materialColour('onPrimaryContainer'),
      'sidebar-members-background': materialColour('onBackground', 94),
      'sidebar-members-foreground': materialColour('onPrimaryContainer'),
      'sidebar-header-background': materialColour('onBackground', 94),
      'sidebar-header-foreground': materialColour('onPrimaryContainer'),
      'sidebar-header-transparent-background': `rgba(${hexToRgb(
        materialColour('onBackground', 94)
      )}, 0.75)`,
      'sidebar-header-with-image-text-background': `rgba(${hexToRgb(
        materialColour('onBackground')
      )}, 0.5)`,
      'sidebar-header-with-image-text-foreground': materialColour('background'),
      'sidebar-server-list-foreground': materialColour('onBackground', 80),
      'sidebar-channels-category-foreground': materialColour(
        'onSurfaceVariant',
        60
      ),
      // OR balls to the wall: (but dark mode gets fucked)
      // "sidebar-channels-background": materialColour("primaryContainer", 94),
      // "sidebar-channels-foreground": materialColour("onPrimaryContainer"),
      // "sidebar-members-background": materialColour("primaryContainer", 94),
      // "sidebar-members-foreground": materialColour("onPrimaryContainer"),
      // "sidebar-header-background": materialColour("primaryContainer", 94),
      // "sidebar-header-foreground": materialColour("onPrimaryContainer"),
      // "sidebar-header-transparent-background": `rgba(${hexToRgb(
      //   materialColour("primaryContainer")
      // )}, 0.75)`,
      // "sidebar-header-with-image-text-background": `rgba(${hexToRgb(
      //   materialColour("onBackground")
      // )}, 0.5)`,
      // "sidebar-header-with-image-text-foreground": materialColour("background"),
      // "sidebar-server-list-foreground": materialColour("onBackground", 80),

      // Messaging: Interface
      'messaging-indicator-background': `rgba(${hexToRgb(
        materialColour('background', 94)
      )}, 0.50)`,
      'messaging-indicator-foreground': materialColour('onBackground'),
      'messaging-indicator-reply-enabled': materialColour('primary'),
      'messaging-indicator-reply-disabled': materialColour('onBackground', 60),
      'messaging-upload-file-background': materialColour('surfaceVariant', 80),
      'messaging-upload-file-foreground': materialColour('onBackground', 98),
      'messaging-upload-divider': materialColour('primary', 85),
      'messaging-message-box-background': materialColour('onBackground', 94),
      'messaging-message-box-foreground': materialColour('onPrimaryContainer'),
      'messaging-message-mentioned-background': materialColour(
        'surfaceVariant',
        97
      ),
      // "messaging-message-box-background": materialColour("primaryContainer"),
      // "messaging-message-box-foreground": materialColour("onPrimaryContainer"),

      // Messaging: Components
      'messaging-component-blocked-message-background': 'transparent',
      'messaging-component-blocked-message-foreground': materialColour(
        'onBackground',
        60
      ),
      'messaging-component-code-block-background':
        materialColour('surfaceVariant'),
      'messaging-component-code-block-foreground':
        materialColour('onSurfaceVariant'),
      'messaging-component-code-block-language-background':
        materialColour('primary'),
      'messaging-component-code-block-language-foreground':
        materialColour('onPrimary'),
      'messaging-component-blockquote-background':
        materialColour('surfaceVariant'),
      'messaging-component-blockquote-foreground':
        materialColour('onSurfaceVariant'),
      'messaging-component-text-embed-background':
        materialColour('surfaceVariant'),
      'messaging-component-text-embed-foreground':
        materialColour('onSurfaceVariant'),
      'messaging-component-attachment-background':
        materialColour('surfaceVariant'),
      'messaging-component-attachment-foreground':
        materialColour('onSurfaceVariant'),
      'messaging-component-message-divider-background': materialColour(
        'onSurfaceVariant',
        80
      ),
      'messaging-component-message-divider-foreground': materialColour(
        'onSurfaceVariant',
        60
      ),
      'messaging-component-message-divider-unread-background':
        materialColour('primary'),
      'messaging-component-message-divider-unread-foreground':
        materialColour('onPrimary'),
      'messaging-component-reaction-background': materialColour(
        'onBackground',
        97
      ),
      'messaging-component-reaction-foreground': materialColour('onBackground'),
      'messaging-component-reaction-selected-background':
        materialColour('primaryContainer'),
      'messaging-component-reaction-selected-foreground':
        materialColour('onPrimaryContainer'),
      'messaging-component-mention-background':
        materialColour('surfaceVariant'),
      'messaging-component-mention-foreground':
        materialColour('onSurfaceVariant'),

      // Settings
      'settings-background': materialColour('secondary', 96),
      'settings-foreground': materialColour('onSecondaryContainer'),
      'settings-content-background': materialColour('secondary', 92),
      'settings-content-foreground': materialColour('onSecondary', 20),
      'settings-content-scroll-thumb': materialColour('secondary', 70),
      'settings-close-anchor': materialColour('primary'),
      'settings-close-anchor-hover': materialColour('onPrimary'),
      'settings-sidebar-category': materialColour('primary'),
      'settings-sidebar-foreground': materialColour('onSecondary', 20),
      'settings-sidebar-button-hover': materialColour('secondary', 90),
      'settings-sidebar-button-active': materialColour('secondary', 82),
      // Temporary Colours
      'temp-1': materialColour('secondary', 85),
    },
    customColours,
    // TODO: deprecate, provide hexToRgb utility instead
    rgb: {
      header: '54,54,54',
      'typing-indicator': '30,30,30',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    borderRadius: {
      sm: '2px',
      md: '6px',
      lg: '12px',
      xl: '16px',
      xxl: '28px',
      full: '100%',
    },
    gap: {
      none: '0',
      xxs: '1px',
      xs: '2px',
      s: '6px',
      sm: '4px',
      md: '8px',
      l: '12px',
      lg: '15px',
      x: '28px',
      xl: '32px',
      xxl: '64px',
    },
    fonts: {
      primary: '"Inter", sans-serif',
      monospace: '"JetBrains Mono", monospace',
    },
    typography: {
      // Form elements
      label: {
        textTransform: 'capitalize',
      },
      // Common UI elements
      chip: {
        fontWeight: 500,
        fontSize: '12px',
      },
      username: {
        fontWeight: 600,
      },
      status: {
        fontSize: '11px',
        fontWeight: 400,
      },
      tooltip: {
        fontWeight: 600,
        fontSize: '13px',
      },
      category: {
        fontWeight: 600,
        fontSize: '0.7rem',
      },
      'menu-button': {
        fontWeight: 600,
        fontSize: '0.90625rem',
      },
      'sidebar-title': {
        margin: 0,
        element: 'h1',
        fontWeight: 600,
        fontSize: '1.2rem',
      },
      'channel-topic': {
        fontWeight: 400,
        fontSize: '0.8em',
      },
      // Messaging specific
      messages: {
        fontSize: '14px',
        fontWeight: 400,
      },
      reply: {
        fontSize: '0.8rem',
      },
      'composition-file-upload-name': {
        fontSize: '0.8em',
      },
      'composition-file-upload-size': {
        fontSize: '0.6em',
      },
      'composition-typing-indicator': {
        element: 'div',
        fontSize: '13px',
      },
      'conversation-channel-name': {
        element: 'h1',
        fontSize: '23px',
        margin: '0 0 8px 0',
      },
      'conversation-start': {
        element: 'h4',
        fontWeight: 400,
        margin: 0,
        fontSize: '14px',
      },
      'conversation-indicator': {
        fontSize: '12px',
        fontWeight: 600,
      },
      'system-message': {
        fontWeight: 700,
      },
      // Settings
      'settings-title': {
        element: 'h1',
        margin: 0,
        fontWeight: 500,
        fontSize: '1.75rem',
      },
      'settings-account-username': {
        fontSize: '20px',
        fontWeight: 600,
      },
      'settings-account-card-title': {
        fontWeight: 600,
      },
      'settings-account-card-subtitle': {
        fontSize: '12px',
      },
      // Modal
      'modal-title': {
        element: 'h2',
        margin: 0,
        fontWeight: 700,
        fontSize: '1.2rem',
      },
      'modal-description': {
        element: 'h2',
        margin: 0,
        fontWeight: 500,
        fontSize: '0.9rem',
      },
      // Home
      'home-page-title': {
        element: 'h1',
        margin: 0,
        lineHeight: '1rem',
        fontWeight: 600,
        fontSize: '1.4rem',
      },
      // Legacy
      'legacy-settings-title': {
        element: 'h1',
        margin: 0,
        lineHeight: '1rem',
        fontWeight: 600,
        fontSize: '1.2rem',
      },
      small: {
        fontSize: '0.7rem',
      },
      'legacy-modal-title': {
        element: 'h2',
        margin: 0,
        fontWeight: 700,
        fontSize: '0.9375rem',
      },
      'legacy-settings-section-title': {
        element: 'h3',
        margin: 0,
        fontWeight: 700,
        fontSize: '0.75rem',
      },
      'legacy-modal-title-2': {
        element: 'h4',
        margin: 0,
        fontWeight: 500,
        fontSize: '0.8125rem',
      },
      'legacy-settings-description': {
        element: 'span',
        margin: 0,
        fontWeight: 500,
        fontSize: '0.8rem',
      },
    },
    transitions: {
      fast: '.1s ease-in-out',
      medium: '.2s ease',
    },
    effects: {
      blur: {
        md: 'blur(20px)',
      },
      ripple: {
        hover: 0.05,
      },
      invert: {
        black: darkMode ? 'invert(100%)' : 'invert(0%)',
        white: darkMode ? 'invert(0%)' : 'invert(100%)',
      },
      muted: 'brightness(0)', // DEPRECATE
      hover: 'brightness(0)', // DEPRECATE
      active: 'brightness(0)', // DEPRECATE
      // muted: "brightness(0.5) saturate(0.75)",
      // hover: "brightness(1.1)",
      // active: "brightness(0.9)",
      spoiler: 'brightness(0.2) contrast(0.8) blur(24px)',
    },
    layout: {
      width: {
        // "channel-sidebar": "232px", (without margins)
        'channel-sidebar': '248px',
      },
      height: {
        header: '48px',
        'tall-header': '120px',
        'message-box': '48px',
        'attachment-preview': '100px',
      },
      attachments: {
        'min-width': '240px',
        'max-width': '420px',
        'min-height': '120px',
        'max-height': '420px',
      },
      emoji: {
        small: '1.4em',
        medium: '48px',
        large: '96px',
      },
      zIndex: {
        'floating-bar': 20,
        modal: 50,
        'floating-element': 100,
      },
    },
  };
};
