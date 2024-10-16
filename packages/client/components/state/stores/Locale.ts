import type { Language } from '@revolt/i18n';
import { browserPreferredLanguage, Languages, setLanguage } from '@revolt/i18n';

import type { State } from '..';
import { AbstractStore } from '.';

export interface TypeLocale {
  /**
   * Current language in use
   */
  lang: Language;
}

/**
 * Manage localisation of the application
 */
export class Locale extends AbstractStore<'locale', TypeLocale> {
  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, 'locale');
  }

  /**
   * Hydrate external context
   */
  hydrate(): void {
    setLanguage(this.get().lang);
  }

  /**
   * Generate default values
   */
  default(): TypeLocale {
    return {
      lang: browserPreferredLanguage() as Language,
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeLocale>): TypeLocale {
    let lang: Language = input.lang!;
    if (!(lang in Languages)) {
      lang = this.default().lang;
    }

    return {
      lang,
    };
  }

  /**
   * Switch to another language
   * @param language Language
   */
  switch(language: Language): void {
    this.set('lang', language);
    this.hydrate();
  }
}
