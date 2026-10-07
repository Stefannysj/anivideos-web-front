import type { TranslationKey } from '../i18n/translations.js';

export interface BlogArticleMeta {
  slug: string;
  titleKey: TranslationKey;
  excerptKey: TranslationKey;
  date: string;
  kind: 'review' | 'season' | 'ranking' | 'guide';
}

export const blogArticles: readonly BlogArticleMeta[] = [
  { slug: 'resena-frieren-sin-spoilers', titleKey: 'blog.article.frieren.title', excerptKey: 'blog.article.frieren.excerpt', date: '2026-10-05', kind: 'review' },
  { slug: 'guia-estrenos-anime-temporada', titleKey: 'blog.article.season.title', excerptKey: 'blog.article.season.excerpt', date: '2026-10-05', kind: 'season' },
  { slug: 'ranking-fuentes-legales', titleKey: 'blog.article.ranking.title', excerptKey: 'blog.article.ranking.excerpt', date: '2026-10-05', kind: 'ranking' },
  { slug: 'guia-ova-tv-pelicula', titleKey: 'blog.article.formats.title', excerptKey: 'blog.article.formats.excerpt', date: '2026-10-05', kind: 'guide' },
];
