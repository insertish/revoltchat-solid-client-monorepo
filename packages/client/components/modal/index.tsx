import '../ui/styled.d.ts';

import { registerController } from '@revolt/common';
import type { MFA, MFATicket } from 'revolt.js';
import { For } from 'solid-js';
import type { SetStoreFunction } from 'solid-js/store';
import { createStore } from 'solid-js/store';

import { RenderModal } from './modals';
import type { Modals } from './types';

export interface ActiveModal {
  /**
   * Unique modal Id
   */
  id: string;

  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Props to pass to modal
   */
  props: Modals;
}

/**
 * Global modal controller for layering and displaying one or more modal to the user
 */
export class ModalController {
  modals: ActiveModal[];
  setModals: SetStoreFunction<ActiveModal[]>;

  /**
   * Construct controller
   */
  constructor() {
    const [modals, setModals] = createStore<ActiveModal[]>([]);
    this.modals = modals;
    this.setModals = setModals;

    this.pop = this.pop.bind(this);

    // TODO: this should instead work using some sort of priority queue system from a dedicated keybind handler
    // so that, for example, popping draft does not conflict with closing the current modal
    // example API: registerKeybind(key = 'Escape', priority = 20, fn = () => void)
    // => event.stopPropagation

    /**
     * Handle key press
     * @param event Event
     */
    function keyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        modalController.pop();
      }
    }

    document.addEventListener('keydown', keyDown);
  }

  /**
   * Add a modal to the stack
   * @param props Modal parameters
   */
  push(props: Modals) {
    this.setModals([
      ...this.modals,
      {
        // just need something unique
        id: Math.random().toString(),
        show: true,
        props,
      },
    ]);
  }

  /**
   * Remove the top modal
   */
  pop() {
    const modal = [...this.modals].reverse().find((modal) => modal.show);

    if (modal) {
      this.remove(modal.id);
    }
  }

  /**
   * Close modal by id
   */
  remove(id: string) {
    this.setModals((entry) => entry.id === id, 'show', false);

    setTimeout(() => {
      this.setModals(this.modals.filter((entry) => entry.id !== id));
    }, 500); /** FIXME / TODO: set to motion anim time + 100ms */
  }

  /**
   * Whether a modal is currently open
   * @returns Boolean
   */
  isOpen() {
    return !!this.modals.find((x) => x.show);
  }
}

/**
 * Modal controller with additional helpers.
 */
export class ModalControllerExtended extends ModalController {
  /**
   * Construct controller
   */
  constructor() {
    super();
    registerController('modal', this);
  }

  /**
   * Perform MFA flow
   * @param mfa MFA helper
   */
  mfaFlow(mfa: MFA) {
    return new Promise((callback: (ticket?: MFATicket) => void) =>
      this.push({
        type: 'mfa_flow',
        state: 'known',
        mfa,
        callback,
      })
    );
  }

  /**
   * Open TOTP secret modal
   * @param client Client
   */
  mfaEnableTOTP(secret: string, identifier: string) {
    return new Promise((callback: (value?: string) => void) =>
      this.push({
        type: 'mfa_enable_totp',
        identifier,
        secret,
        callback,
      })
    );
  }

  /**
   * Write text to the clipboard
   * @param text Text to write
   */
  writeText(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      this.push({
        type: 'clipboard',
        text,
      });
    }
  }

  /**
   * Safely open external or internal link
   * @param href Raw URL
   * @param trusted Whether we trust this link
   * @returns Whether to cancel default event
   */
  openLink(href?: string, trusted?: boolean) {
    /*const link = determineLink(href);
    const settings = getApplicationState().settings;

    switch (link.type) {
      case "navigate": {
        history.push(link.path);
        break;
      }
      case "external": {
        if (!trusted && !settings.security.isTrustedOrigin(link.url.hostname)) {
          modalController.push({
            type: "link_warning",
            link: link.href,
            callback: () => this.openLink(href, true) as true,
          });
        } else {
          window.open(link.href, "_blank", "noreferrer");
        }
      }
    }*/

    return true;
  }
}

export const modalController = new ModalControllerExtended();

export function ModalRenderer() {
  return (
    <For each={modalController.modals}>
      {(entry) => <RenderModal {...entry} />}
    </For>
  );
}
