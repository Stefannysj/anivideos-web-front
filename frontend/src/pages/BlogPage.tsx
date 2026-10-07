import { blogArticles } from '../content/blog.js';
import { t } from '../i18n/i18n.js';

export function BlogPage() {
  return <main className="v16-page"><header className="v16-page__hero"><p className="eyebrow">AniVideos</p><h1>{t('blog.title')}</h1><p>{t('blog.subtitle')}</p></header><div className="v16-blog-grid">{blogArticles.map((article)=><article className="v16-blog-card" key={article.slug}><span>{article.kind} · {article.date}</span><h2>{t(article.titleKey)}</h2><p>{t(article.excerptKey)}</p><a className="button button--secondary" href={`/blog/${article.slug}`}>{t('blog.read')}</a></article>)}</div></main>;
}
