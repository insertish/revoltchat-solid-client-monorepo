import * as i18n from '@solid-primitives/i18n';
import {
  createContext,
  createSignal,
  useContext,
  useTransition,
} from 'solid-js';

import en from './locales/en.json';
import { Language, Languages } from './locales/Languages';

export * from './dayjs';
export { Language, Languages } from './locales/Languages';

/**
 * Default dictionary object
 */
export const dict = {
  en,
};

export type RawDictionary = typeof dict.en;
export type Dictionary = i18n.Flatten<RawDictionary>;

/**
 * Currently set language
 */
const [language, _setLanguage] = createSignal<Language>('en' as Language);
export { language };

/**
 * Use translation function as a hook
 */

export const I18nContext = createContext(
  i18n.translator(() => i18n.flatten(dict.en), i18n.resolveTemplate)
);

export const useTranslation = () => useContext(I18nContext);

const [duringI18nTransition, startI18nTransition] = useTransition();

export { duringI18nTransition };

export async function fetchLanguage(key: Language): Promise<Dictionary> {
  const data = (await import(
    `./locales/${Languages[key].i18n}.json`
  )) as typeof dict.en;
  return i18n.flatten(data);
}

/**
 * set a language by the given key
 */
export function setLanguage(key: Language) {
  startI18nTransition(() => _setLanguage(key));
}

/**
 * Preferred language as reported by the browser
 * @returns Preferred language
 */
export function browserPreferredLanguage() {
  const languages = Object.keys(Languages).map(
    (x) => [x, Languages[x as keyof typeof Languages]] as const
  );

  // Get the user's system language. Check for exact
  // matches first, otherwise check for partial matches
  return (
    navigator.languages
      .map((lang) => languages.find((l) => l[0].replace(/_/g, '-') == lang))
      .filter((lang) => lang)[0]?.[0] ??
    navigator.languages
      .map((x) => x.split('-')[0])
      .map((lang) => languages.find((l) => l[0] == lang))
      .filter((lang) => lang)[0]?.[0] ??
    Language.ENGLISH
  );
}

/**
 * Use quantity translation function as a hook
 */
export const useQuantity = () => {
  const t = useTranslation();
  return (id: 'members' | 'dropFiles', count: number) =>
    t(`quantities.${id}.${count > 1 ? 'many' : 'one'}`, {
      count: count.toString(),
    });
};
