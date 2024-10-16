import type { Language } from '@revolt/i18n/locales/Languages';
import { Languages } from '@revolt/i18n/locales/Languages';
import { state } from '@revolt/state';
import { ComboBox } from '@revolt/ui';
import { For } from 'solid-js';

/**
 * Dropdown box for selecting the current language
 */
export function LocaleSelector() {
  return (
    <ComboBox
      value={state.get('locale').lang}
      onChange={(e) => state.locale.switch(e.currentTarget.value as Language)}
    >
      <For each={Object.keys(Languages)}>
        {(lang) => {
          const l = Languages[lang as Language];
          return (
            <option value={lang}>
              {l.emoji} {l.display}
            </option>
          );
        }}
      </For>
    </ComboBox>
  );
}
