import { debounce } from '@revolt/common';

// note: order dependent!
export const KEYBINDING_MODIFIER_KEYS = ['Control', 'Alt', 'Meta', 'Shift'];

/**
 * Keys that must be pressed at the same time, order should not matter.
 * Should only be include modifiers and one key at the moment.
 */
export type KeyCombo = string[];
export type KeyComboSequence = KeyCombo[];

export const KeyCombo = {
  fromKeyboardEvent(event: KeyboardEvent): KeyCombo {
    const pressed = KEYBINDING_MODIFIER_KEYS.filter((key) =>
      event.getModifierState(key)
    );

    if (!KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
      pressed.push(event.key.replace(' ', 'Space'));
    }

    return pressed;
  },

  // todo: add matches function to better handle browser inconsistencies
  // todo: handle undefines better
  matches(keyComboA?: KeyCombo, keyComboB?: KeyCombo) {
    return (
      keyComboA?.length == keyComboB?.length &&
      keyComboA?.every((key, i) => key == keyComboB?.[i])
    );
  },
};

export const KeybindSequence = {
  /**
   * Parse a stringified keybind seqeuence.
   *
   * @example
   * ```
   * parse('Alt+ArrowUp')
   * parse('Control+k b')
   * ```
   */
  parse(sequence: string): KeyComboSequence {
    return sequence.split(' ').map((expr) => expr.split('+'));
  },

  /** Stringify a keybind sequence */
  stringify(sequence: KeyComboSequence) {
    return sequence.map((combo) => combo.join('+')).join(' ');
  },

  /** Checks to see if two key sequences match */
  matches(keySequenceA?: KeyComboSequence, keySequenceB?: KeyComboSequence) {
    return (
      keySequenceA?.length == keySequenceB?.length &&
      keySequenceA?.every((key, i) => KeyCombo.matches(key, keySequenceB?.[i]))
    );
  },
};

// having the type be 'keybind' would be more idiomatic but this works better as an api
export class KeybindEvent<T extends string> extends KeyboardEvent {
  constructor(
    public action: T,
    eventInitDict?: KeyboardEventInit | undefined
  ) {
    super(action, eventInitDict);
  }
}

export class KeybindEventHandler<
  KeybindAction extends string,
> extends EventTarget {
  possibleSequences = new Map<KeyComboSequence, KeyCombo[]>();

  // todo: measure memory and performance between this and manually setting a `keybinds` property
  constructor(
    public getKeybinds: () => Record<KeybindAction, KeyComboSequence[]>
  ) {
    super();
  }

  resetPossibleSequences = () =>
    debounce(() => this.possibleSequences.clear(), 1000);

  handleEvent(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.repeat) return;

    const combo = KeyCombo.fromKeyboardEvent(event);

    const keybinds = this.getKeybinds();
    actionLoop: for (const action in keybinds) {
      const keybindings = keybinds[action as KeybindAction];
      for (const sequence of keybindings) {
        // skip unassigned keybinds
        if (sequence.length === 0) continue;

        const expectedSequence =
          this.possibleSequences.get(sequence) ?? sequence;

        const matched = KeyCombo.matches(expectedSequence[0], combo);

        if (matched) {
          if (expectedSequence.length > 1) {
            this.possibleSequences.set(sequence, expectedSequence.slice(1));
          } else {
            this.possibleSequences.delete(sequence);
            console.info('dispatch', action, event);
            this.dispatchEvent(
              new KeybindEvent(action as KeybindAction, event)
            );
            break actionLoop;
          }
        } else if (KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
          this.possibleSequences.delete(sequence);
        }
      }
    }

    this.resetPossibleSequences();
  }

  // todo: use typed event target, internal events, or solid events?
  declare addEventListener: (
    type: KeybindAction,
    callback:
      | ((event: KeybindEvent<KeybindAction>) => void)
      | EventListenerObject
      | null,
    options?: AddEventListenerOptions | boolean
  ) => void;

  /** Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise. */
  declare dispatchEvent: (event: KeybindEvent<KeybindAction>) => boolean;

  /** Removes the event listener in target's event listener list with the same type, callback, and options. */
  declare removeEventListener: (
    type: KeybindAction,
    callback:
      | ((event: KeybindEvent<KeybindAction>) => void)
      | EventListenerObject
      | null,
    options?: EventListenerOptions | boolean
  ) => void;
}

export * from './actions';
