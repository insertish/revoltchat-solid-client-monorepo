import type { Placement } from '@floating-ui/dom';
import type { AutoCompleteState } from '@revolt/ui/directives';
import type { Channel, Client, ServerMember, User } from 'revolt.js';
import { type SolidOptions } from 'solid-dnd-directive';
import type { Component } from 'solid-js';

export {};

declare global {
  interface Window {
    __TAURI__: object;
  }
}

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      dndzone: SolidOptions;
      ripple:
        | true
        | {
            enable: boolean;

            /**
             * Pass-through class names
             */
            class?: string;
          };
      scrollable:
        | true
        | {
            /**
             * Scroll direction
             */
            direction?: 'x' | 'y';

            /**
             * Offset to apply to top of scroll container
             */
            offsetTop?: number;

            /**
             * Whether to only show scrollbar on hover
             */
            showOnHover?: boolean;

            /**
             * Pass-through class names
             */
            class?: string;

            /**
             * Set custom foreground on track
             */
            foreground?: string;

            /**
             * Set custom background on track
             */
            background?: string;
          };
      invisibleScrollable:
        | true
        | {
            /**
             * Scroll direction
             */
            direction?: 'x' | 'y';

            /**
             * Pass-through class names
             */
            class?: string;
          };
      floating: {
        tooltip?: {
          /**
           * Where the tooltip should be placed
           */
          placement: Placement;
        } & (
          | {
              /**
               * Tooltip content
               */
              content: Component;

              /**
               * Aria label fallback
               */
              aria: string;
            }
          | {
              /**
               * Tooltip content
               */
              content: string | undefined;

              /**
               * Content is used as aria fallback
               */
              aria?: undefined;
            }
        );
        userCard?: {
          /**
           * User to display
           */
          user: User;

          /**
           * Member to display
           */
          member?: ServerMember;
        };
        contextMenu?: Component;
        autoComplete?: {
          state: Accessor<AutoCompleteState>;
          selection: Accessor<number>;
          select: (index: number) => void;
        };
      };
      autoComplete:
        | true
        | {
            client?: Client;
            onKeyDown?: (
              event: KeyboardEvent & { currentTarget: HTMLTextAreaElement }
            ) => void;
            searchSpace?: {
              users?: User[];
              members?: ServerMember[];
              channels?: Channel[];
            };
          };
    }
  }
}
