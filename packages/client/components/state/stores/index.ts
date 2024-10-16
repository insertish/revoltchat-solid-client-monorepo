import type { SetStoreFunction } from 'solid-js/store';

import type { State } from '..';
import type { TypeAuth } from './Auth';
import type { TypeDraft } from './Draft';
import type { TypeExperiments } from './Experiments';
import type { TypeKeybinds } from './Keybinds';
import type { TypeLayout } from './Layout';
import type { TypeLocale } from './Locale';
import type { TypeNotificationOptions } from './NotificationOptions';
import type { TypeOrdering } from './Ordering';
import type { TypeSettings } from './Settings';

export interface Store {
  auth: TypeAuth;
  draft: TypeDraft;
  experiments: TypeExperiments;
  keybinds: TypeKeybinds;
  layout: TypeLayout;
  locale: TypeLocale;
  notifications: TypeNotificationOptions;
  ordering: TypeOrdering;
  settings: TypeSettings;
}

/**
 * Abstract store implementation
 */
export abstract class AbstractStore<T extends keyof Store, D> {
  /**
   * Marker used to determine whether this is a store
   */
  private readonly _storeHint = true;

  /**
   * Reference to the current state
   */
  protected readonly state: State;

  /**
   * This store's key
   */
  private readonly key: T;

  /**
   * Construct a new store
   * @param state Reference to current state
   * @param key This store's key
   */
  constructor(state: State, key: T) {
    this.state = state;
    this.key = key;
  }

  /**
   * Get this store's key
   * @returns Key
   */
  getKey(): T {
    return this.key;
  }

  /**
   * Set some value in this store
   */
  protected set: SetStoreFunction<Store[T]> = (...args: any[]) => {
    (this.state.set as any)(this.key, ...args);
  };

  /**
   * Get this store's value
   */
  protected get() {
    return this.state.get(this.key);
  }

  /**
   * Hydrate external context
   */
  abstract hydrate(): void;

  /**
   * Generate default values
   */
  abstract default(): D;

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  abstract clean(input: Partial<D>): D;
}
