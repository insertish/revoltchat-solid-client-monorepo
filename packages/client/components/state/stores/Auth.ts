import { TransitionType } from '@revolt/client/Controller';
import { CONFIGURATION, getController } from '@revolt/common';

import type { State } from '..';
import { AbstractStore } from '.';

export interface Session {
  _id: string;
  token: string;
  userId: string;
  valid: boolean;
}

export interface TypeAuth {
  /**
   * Session information
   */
  session?: Session;
}

/**
 * Authentication details store
 */
export class Auth extends AbstractStore<'auth', TypeAuth> {
  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, 'auth');
  }

  /**
   * Hydrate external context
   */
  hydrate(): void {
    if (CONFIGURATION.DEVELOPMENT_TOKEN && CONFIGURATION.DEVELOPMENT_USER_ID) {
      this.setSession({
        _id: CONFIGURATION.DEVELOPMENT_SESSION_ID ?? '0',
        token: CONFIGURATION.DEVELOPMENT_TOKEN,
        userId: CONFIGURATION.DEVELOPMENT_USER_ID,
        valid: true,
      });
    }

    const session = this.getSession();
    if (session) {
      const clientController = getController('client');
      clientController.lifecycle.transition({
        type: TransitionType.LoginCached,
        session,
      });
    }
  }

  /**
   * Generate default values
   */
  default(): TypeAuth {
    return {
      session: undefined,
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeAuth>): TypeAuth {
    let session;
    if (typeof input.session === 'object') {
      if (
        typeof input.session._id === 'string' &&
        typeof input.session.token === 'string' &&
        typeof input.session.userId === 'string' &&
        input.session.valid
      ) {
        session = {
          _id: input.session._id,
          token: input.session.token,
          userId: input.session.userId,
          valid: true,
        };
      }
    }

    return {
      session,
    };
  }

  /**
   * Get current session.
   * @returns Session
   */
  getSession() {
    return this.get().session;
  }

  /**
   * Add a new session to the auth manager.
   * @param session Session
   */
  setSession(session: Session) {
    this.set('session', session);
  }

  /**
   * Remove existing session.
   */
  removeSession() {
    this.set('session', undefined!);
  }

  /**
   * Mark current session as valid
   */
  markValid() {
    const session = this.get().session;
    if (session && !session.valid) {
      this.set('session', 'valid', true);
    }
  }
}
