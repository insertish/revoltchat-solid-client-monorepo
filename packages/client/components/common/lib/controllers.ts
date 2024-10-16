import type { ClientController } from '@revolt/client';
import type { ModalControllerExtended } from '@revolt/modal';
import type { State } from '@revolt/state';

/**
 * Single source of truth for global state controllers
 *
 * This is used to avoid circular dependency issues
 */
class Controllers {
  // @ts-expect-error dynamic initialisation
  client: ClientController;
  // @ts-expect-error dynamic initialisation
  modal: ModalControllerExtended;
  // @ts-expect-error dynamic initialisation
  state: State;

  constructor() {
    (window as unknown as { controllers: Controllers }).controllers = this;
  }
}

/**
 * Singleton
 */
const controllers = new Controllers();

/**
 * Register a controller
 * @param key Controller name
 * @param value Controller itself
 */
export function registerController<K extends keyof typeof controllers>(
  key: K,
  value: (typeof controllers)[K]
) {
  controllers[key] = value;
}

/**
 * Get a typed controller by its name
 * @param key Controller name
 * @returns Controller itself
 */
export function getController<K extends keyof typeof controllers>(
  key: K
): (typeof controllers)[K] {
  return controllers[key];
}
