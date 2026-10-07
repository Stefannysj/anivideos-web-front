import { t } from '../i18n/i18n.js';

export interface NavigationItem {
  label: string;
  href: `#${string}`;
}

export const navigationItems = [
  { label: t('nav.home'), href: '#inicio' },
  { label: t('category.anime'), href: '#anime' },
  { label: t('category.k-drama'), href: '#k-dramas' },
  { label: t('category.j-drama'), href: '#j-dramas' },
  { label: t('category.donghua'), href: '#donghua' },
  { label: t('category.movie'), href: '#peliculas' },
  { label: t('category.ova'), href: '#ovas' },
] as const satisfies readonly NavigationItem[];
