import 'solid-styled-components';

import type {
  ColorGroup,
  CustomColorGroup,
  Scheme,
  TonalPalette,
} from '@material/material-color-utilities';

/**
 * Declare our custom theme options
 */
declare module 'solid-styled-components' {
  export interface DefaultTheme {
    /* colour(base: keyof Scheme, tone?: number): string;
    scheme: Record<keyof Scheme, string>;
    tones: Record<keyof Scheme, TonalPalette>; */
    darkMode: boolean;
    customColours: Record<
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
    colours: {
      [key in
        | 'background'
        | 'foreground'
        | `component-${
            | `${'fab' | 'checkbox' | 'scrollbar'}-${
                | 'background'
                | 'foreground'}`
            | 'checkbox-foreground-check'
            | 'chip-background'
            | `btn-${'background' | 'foreground'}-${'primary' | 'secondary'}`
            | `btn-foreground-${'plain' | 'plain-secondary'}`
            | `menubtn-${'default' | 'selected' | 'muted' | 'hover'}-${
                | 'background'
                | 'foreground'}`
            | `input-${'foreground' | 'focus'}`
            | `input-${'background' | 'hover'}-${'primary' | 'secondary'}`
            | `categorybtn-${
                | 'background'
                | 'foreground'
                | 'foreground-description'
                | `background-${'icon' | 'collapse' | 'hover' | 'active'}`}`
            | `modal-${'background' | 'foreground'}`
            | `avatar-fallback${'-contrast' | ''}-${
                | 'background'
                | 'foreground'}`
            | `context-menu-${
                | 'background'
                | 'foreground'
                | 'item-hover-background'
                | 'divider'
                | 'shadow'}`
            | `key-${'background' | 'foreground'}`
            | `combo-${'focus' | 'background' | 'foreground'}`}`
        | `preloader-foreground`
        | `sidebar-${
            | 'header-transparent-background'
            | 'server-list-foreground'
            | 'channels-category-foreground'
            | `${
                | 'channels'
                | 'members'
                | 'header'
                | 'header-with-image-text'}-${'background' | 'foreground'}`}`
        | `messaging-${
            | `indicator-${'background' | 'foreground'}`
            | `indicator-reply-${'enabled' | 'disabled'}`
            | `upload-${'file-background' | 'file-foreground' | 'divider'}`
            | `message-box-${'background' | 'foreground'}`
            | `message-mentioned-background`
            | `component-${`${
                | 'blocked-message'
                | 'code-block'
                | 'blockquote'
                | 'text-embed'
                | 'attachment'
                | 'code-block-language'
                | 'message-divider'
                | 'message-divider-unread'
                | 'reaction'
                | 'reaction-selected'
                | 'mention'}-${'background' | 'foreground'}`}`}`
        | `settings-${
            | 'background'
            | 'foreground'
            | `content-${'background' | 'foreground' | 'scroll-thumb'}`
            | `close-anchor${'' | '-hover'}`
            | `sidebar-${
                | 'category'
                | 'foreground'
                | `button-${'hover' | 'active'}`}`}`
        | `temp-1`]: string;
    };
    rgb: {
      [key in 'header' | 'typing-indicator']: string;
    };
    breakpoints: {
      [key in 'sm' | 'md' | 'lg' | 'xl']: string;
    };
    borderRadius: {
      [key in 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full']: string;
    };
    gap: {
      [key in
        | 'none'
        | 'xxs'
        | 'xs'
        | 's'
        | 'sm'
        | 'md'
        | 'l'
        | 'lg'
        | 'x'
        | 'xl'
        | 'xxl']: string;
    };
    fonts: {
      [key in 'primary' | 'monospace']: string;
    };
    typography: {
      [key in
        | 'label'
        | 'chip'
        | 'username'
        | 'status'
        | 'tooltip'
        | 'category'
        | 'menu-button'
        | 'messages'
        | 'reply'
        | 'composition-file-upload-name'
        | 'composition-file-upload-size'
        | 'composition-typing-indicator'
        | 'conversation-channel-name'
        | 'conversation-start'
        | 'conversation-indicator'
        | 'system-message'
        | 'sidebar-title'
        | 'channel-topic'
        | 'settings-title'
        | 'settings-account-username'
        | 'settings-account-card-title'
        | 'settings-account-card-subtitle'
        | 'modal-title'
        | 'modal-description'
        | 'home-page-title'
        | 'legacy-settings-title'
        | 'small'
        | 'legacy-modal-title'
        | 'legacy-settings-section-title'
        | 'legacy-modal-title-2'
        | 'legacy-settings-description']: {
        [key in
          | 'margin'
          | 'fontWeight'
          | 'fontSize'
          | 'lineHeight'
          | 'textTransform']?: number | string;
      } & {
        element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span' | 'div' | 'label';
        colour?: keyof DefaultTheme['colours'];
      };
    };
    transitions: {
      [key in 'fast' | 'medium']: string;
    };
    effects: {
      blur: {
        [key in 'md']: string;
      };
      ripple: {
        hover: number;
      };
      invert: {
        black: string;
        white: string;
      };
      muted: string;
      hover: string;
      active: string;
      spoiler: string;
    };
    layout: {
      width: {
        [key in 'channel-sidebar']: string;
      };
      height: {
        [key in
          | 'header'
          | 'tall-header'
          | 'message-box'
          | 'attachment-preview']: string;
      };
      attachments: {
        [key in `${'min' | 'max'}-${'width' | 'height'}`]: string;
      };
      emoji: {
        [key in 'small' | 'medium' | 'large']: string;
      };
      zIndex: {
        [key in 'floating-bar' | 'modal' | 'floating-element']: number;
      };
    };
  }
}
