import { es } from './translations.js';
import type { TranslationKey } from './translations.js';

/** v16 translation-key foundation. v18 will replace the resolver with react-i18next and four locale files. */
export function t(key: TranslationKey, variables?: Record<string, string | number>): string {
  let value: string = es[key];
  if (!variables) return value;
  for (const [name, replacement] of Object.entries(variables)) {
    value = value.replaceAll(`{{${name}}}`, String(replacement));
  }
  return value;
}
