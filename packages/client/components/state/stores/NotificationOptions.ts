import { Channel, Server } from 'revolt.js';

import type { State } from '..';
import { AbstractStore } from '.';

/**
 * Possible notification states
 */
export type NotificationState = 'all' | 'mention' | 'none' | 'muted';

/**
 * Possible notification states
 */
const NotificationStates: NotificationState[] = [
  'all',
  'mention',
  'none',
  'muted',
];

/**
 * Default notification states for various types of channels
 */
export const DEFAULT_STATES: {
  [key in Channel['type']]: NotificationState;
} = {
  SavedMessages: 'all',
  DirectMessage: 'all',
  Group: 'all',
  TextChannel: undefined!,
  VoiceChannel: undefined!,
};

/**
 * Default state for servers
 */
export const DEFAULT_SERVER_STATE: NotificationState = 'mention';

export interface TypeNotificationOptions {
  /**
   * Per-server settings
   */
  server: Record<string, NotificationState>;

  /**
   * Per-channel settings
   */
  channel: Record<string, NotificationState>;
}

/**
 * Create a notification either directly or using service worker
 * @param title Notification Title
 * @param options Notification Options
 * @returns Notification
 */
async function createNotification(
  title: string,
  options: globalThis.NotificationOptions
) {
  try {
    return new Notification(title, options);
  } catch (err) {
    const sw = await navigator.serviceWorker.getRegistration();
    sw?.showNotification(title, options);
  }
}

/**
 * Manages the user's notification preferences.
 */
export class NotificationOptions extends AbstractStore<
  'notifications',
  TypeNotificationOptions
> {
  private activeNotifications: Record<string, Notification> = {};

  /**
   * Construct new Experiments store.
   */
  constructor(state: State) {
    super(state, 'notifications');
  }

  /**
   * Hydrate external context
   */
  hydrate(): void {
    /** nothing needs to be done */
  }

  /**
   * Generate default values
   */
  default(): TypeNotificationOptions {
    return {
      server: {},
      channel: {},
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeNotificationOptions>): TypeNotificationOptions {
    const server: TypeNotificationOptions['server'] = {};
    const channel: TypeNotificationOptions['channel'] = {};

    if (typeof input.server === 'object') {
      for (const serverId of Object.keys(input.server)) {
        const entry = input.server[serverId];
        if (NotificationStates.includes(entry)) {
          server[serverId] = entry;
        }
      }
    }

    if (typeof input.channel === 'object') {
      for (const channelId of Object.keys(input.channel)) {
        const entry = input.channel[channelId];
        if (NotificationStates.includes(entry)) {
          channel[channelId] = entry;
        }
      }
    }

    return {
      server,
      channel,
    };
  }

  /**
   * Compute the notification state for a given Server
   * @param server Server
   * @returns Notification state
   */
  computeForServer(server?: Server) {
    return server
      ? (this.get().server[server.id] ?? DEFAULT_SERVER_STATE)
      : undefined;
  }

  /**
   * Compute the actual notification state for a given Channel
   * @param channel Channel
   * @returns Notification state
   */
  computeForChannel(channel: Channel) {
    return (
      this.get().channel[channel.id] ??
      this.computeForServer(channel.server) ??
      DEFAULT_STATES[channel.type]
    );
  }

  /**
   * Check whether a Channel or Server is muted
   * @param target Channel or Server
   * @returns Whether this object is muted
   */
  isMuted(target?: Channel | Server) {
    let value: NotificationState | undefined;
    if (target instanceof Channel) {
      value = this.computeForChannel(target);
    } else if (target instanceof Server) {
      value = this.computeForServer(target);
    }

    if (value === 'muted') {
      return true;
    }

    return false;
  }
}
