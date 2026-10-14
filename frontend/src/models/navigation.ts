import type { TranslationKey } from '../i18n/translations.js';

export interface NavigationItem {
  labelKey: TranslationKey;
  href: `#${string}`;
}

/** AniList-only navigation. TMDB-dependent sections are intentionally hidden. */
export const navigationItems = [
  { labelKey: 'nav.home', href: '#inicio' },
  { labelKey: 'nav.catalog', href: '#catalogo' },
  { labelKey: 'category.anime', href: '#anime' },
  { labelKey: 'category.ova', href: '#ovas' },
] as const satisfies readonly NavigationItem[];
