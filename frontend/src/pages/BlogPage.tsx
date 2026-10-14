import { blogArticles } from '../content/blog.js';
import { formatDate, getActiveLocale, t } from '../i18n/i18n.js';
import { routeHref } from '../i18n/routes.js';
const kindKey={review:'blog.kind.review',season:'blog.kind.guide',ranking:'blog.kind.ranking',guide:'blog.kind.guide'} as const;
export function BlogPage(){const locale=getActiveLocale();return <main className="v16-page"><header className="v16-page__hero"><p className="eyebrow">AniVideos</p><h1>{t('blog.title')}</h1><p>{t('blog.subtitle')}</p></header><div className="v16-blog-grid">{blogArticles.map((article)=><article className="v16-blog-card" key={article.slug}><span>{t(kindKey[article.kind])} · {formatDate(article.date)}</span><h2>{t(article.titleKey)}</h2><p>{t(article.excerptKey)}</p><a className="button button--secondary" href={routeHref(locale,{kind:'article',slug:article.slug})}>{t('blog.read')}</a></article>)}</div></main>;}
