import { useTranslation } from '@revolt/i18n';
import type { KeyComboSequence as TKeySequence } from '@revolt/keybinds';
import { KEYBINDING_MODIFIER_KEYS } from '@revolt/keybinds';
import { Button, KeySequence, styled } from '@revolt/ui';
import { BiRegularReset } from 'solid-icons/bi';
import { createSignal, onMount } from 'solid-js';

import type { PropGenerator } from '../types';

const Container = styled('div', 'EditKeybind-Container')`
  display: flex;
  gap: 1ch;
  place-items: center;
`;

const KeybindInput = styled('output', 'EditKeybind-KeybindInput')`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  min-width: 0;
  flex-grow: 1;
  padding: 8px;
  font-family: ${({ theme }) => theme?.fonts.monospace};
  border-radius: ${({ theme }) => theme?.borderRadius.md};
  background: var(--unset-bg);
  height: 4ch;
  kbd {
    flex-wrap: wrap;
  }
`;

const REPLACEMENTS: Record<string, string> = {
  ' ': 'Space',
};

// TODO: maybe add warning if the user doesn't have a modifier included?
export const EditKeybind: PropGenerator<'edit_keybind'> = (props) => {
  const t = useTranslation();

  const [sequence, setSequence] = createSignal<TKeySequence>([]);
  // temporary state for modifier keys to live in so it still feels resposive when making combos
  const [mods, setMods] = createSignal<string[]>([]);
  let okButton: HTMLButtonElement;
  let input: HTMLOutputElement;
  // TODO: use DOM types instead
  let timer: NodeJS.Timeout;

  const submit = () => {
    // TODO: warning about this instead of silently failing
    if (sequence().length > 0) {
      props.onSubmit(sequence());
    }
  };

  const focusSubmit = () => {
    clearTimeout(timer);
    okButton!.focus();
  };

  const reset = () => {
    setSequence([]);
    setMods([]);
    input?.focus();
  };

  function onKeyDown(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();

    if (event.repeat) return;
    timer && clearTimeout(timer);

    const mods = KEYBINDING_MODIFIER_KEYS.filter((mod) =>
      event.getModifierState(mod)
    );

    if (KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
      setMods(mods);
    } else {
      setMods([]);
      setSequence((seq) => [
        ...seq,
        [...mods, REPLACEMENTS[event.key] ?? event.key],
      ]);
      if (sequence().length >= 1) {
        focusSubmit();
      }
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();

    // Allow the user to use keyboard navigation again.
    if (mods.length === 0) {
      timer = setTimeout(() => {
        focusSubmit();
      }, 1000);
    }

    if (mods.length > 0 && KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
      setSequence((seq) => [...seq, mods()]);
      setMods([]);
      if (sequence().length >= 1) {
        focusSubmit();
      }
    }
  }

  onMount(() => {
    input.focus();
  });

  return {
    // TODO: the way this reads and looks is awkward, find a better way
    title: t('app.special.modals.edit_keybind.title', {
      action: t(`app.settings.pages.keybinds.action.${props.action}.title`),
    }),
    actions: [
      {
        ref: (el: any) => (okButton = el),
        onClick: () => {
          submit();
          return true;
        },
        confirmation: true,
        children: t('app.special.modals.actions.ok'),
      },
      {
        onClick: () => true,
        confirmation: false,
        children: t('app.special.modals.actions.cancel'),
      },
    ],
    children: (
      <Container>
        <KeybindInput
          tabIndex={0}
          ref={input!}
          onFocus={reset}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        >
          {<KeySequence sequence={[mods()].concat(sequence())} short />}
        </KeybindInput>
        <Button
          // title="clear input"
          onPress={reset}
        >
          <BiRegularReset size={20} />
        </Button>
      </Container>
    ),
  };
};

export default EditKeybind;
