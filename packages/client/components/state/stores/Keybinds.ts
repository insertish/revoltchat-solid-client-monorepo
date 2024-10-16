import type { KeybindActions, KeyComboSequence } from '@revolt/keybinds';
import { KeybindAction, KeybindSequence, KeyCombo } from '@revolt/keybinds';

import type { State } from '..';
import { AbstractStore } from '.';

/** utility to make writing the default keybinds easier, requires all `KeybindAction` values to be filled out */
function keybindMap(
  obj: Record<KeybindAction, string[]>
): Record<KeybindAction, KeyComboSequence[]> {
  const entries = Object.entries(obj) as [KeybindAction, string[]][];
  const parsed = entries.map(([act, seqs]) => [
    act,
    seqs.map((seq) => KeybindSequence.parse(seq)),
  ]);
  return Object.fromEntries(parsed);
}

export const DEFAULT_VALUES: KeybindActions = keybindMap({
  [KeybindAction.NavigateChannelUp]: ['Alt+ArrowUp'],
  [KeybindAction.NavigateChannelDown]: ['Alt+ArrowDown'],
  // temporary, Control+Alt+ArrowUp does not seem to work on chrome or firefox at the moment
  [KeybindAction.NavigateServerUp]: ['Control+ArrowUp'],
  [KeybindAction.NavigateServerDown]: ['Control+ArrowDown'],

  [KeybindAction.AutoCompleteUp]: ['ArrowUp'],
  [KeybindAction.AutoCompleteDown]: ['ArrowDown'],
  [KeybindAction.AutoCompleteSelect]: ['Enter', 'Tab'],

  [KeybindAction.NavigatePreviousContext]: [], //["Escape"],
  [KeybindAction.NavigatePreviousContextModal]: [],
  [KeybindAction.NavigatePreviousContextSettings]: [],

  [KeybindAction.InputForceSubmit]: ['Control+Enter'],
  [KeybindAction.InputSubmit]: ['Enter'],
  [KeybindAction.InputCancel]: [], // ["Escape"],

  [KeybindAction.MessagingMarkChannelRead]: [], // ["Escape"],
  [KeybindAction.MessagingScrollToBottom]: ['Escape'],
  [KeybindAction.MessagingEditPreviousMessage]: ['ArrowUp'],

  [KeybindAction.DeveloperToggleAllExperiments]: [],
});

export interface TypeKeybinds {
  keybinds: KeybindActions;
}

export class Keybinds extends AbstractStore<'keybinds', TypeKeybinds> {
  keybinds = Map;

  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, 'keybinds');
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
  default() {
    return {
      keybinds: DEFAULT_VALUES,
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeKeybinds>): TypeKeybinds {
    const actions = this.default();
    // TODO: implement this
    // throw new Error(`clean is not implemented for Keybinds yet`);
    return { keybinds: { ...actions.keybinds, ...input.keybinds } };
  }

  getKeybinds() {
    return this.get().keybinds;
  }

  /** Get the default built-in keybind of an action */
  getDefaultKeybind(action: KeybindAction, index: number) {
    return this.default().keybinds[action]?.[index];
  }

  /**
   * Binds a keybind to an action at the given index
   * @param action action to bind to
   * @param index index to bind to
   * @param sequence the keybind sequence
   */
  setKeybind(action: KeybindAction, index: number, sequence: KeyComboSequence) {
    this.set('keybinds', action, index, sequence);
  }

  /**
   * Adds a new keybind to an action
   * @param action the action to add a keybind to
   * @param sequence the keybind sequence to add
   */
  addKeybind(action: KeybindAction, sequence: KeyComboSequence) {
    this.set('keybinds', action, (keybinds) => [...keybinds, sequence]);
  }

  /**
   * Resets a keybind back to the built-in default.
   * If there is none, remove it from the list of keybinds for the given action.
   * @param action action to reset
   * @param index index to reset
   */
  resetKeybindToDefault(action: KeybindAction, index: number) {
    const defaultValue = this.getDefaultKeybind(action, index);
    if (defaultValue) {
      this.set('keybinds', action, index, defaultValue);
    } else {
      // todo: maybe convert into a more efficient utility
      this.set('keybinds', action, (keybinds) => {
        // shallow copy so splice doesn't mutate the original
        keybinds = [...keybinds];
        keybinds.splice(index, 1);
        return keybinds;
      });
    }
  }

  /**
   * Checks to see if a keybind is the default value
   * @param action The action to check
   * @param index The index to check
   */
  isDefaultKeybind(action: KeybindAction, index: number) {
    const keybindSequence = this.getKeybinds()?.[action]?.[index];
    const defaultSequence = DEFAULT_VALUES[action][index];
    return KeybindSequence.matches(keybindSequence, defaultSequence);
  }

  isDefaultIndex(action: KeybindAction, index: number) {
    return index < DEFAULT_VALUES[action].length;
  }
}
