import { useEffect, useState } from 'react';
import { MarkdownArticle } from '../components/MarkdownArticle.js';
import { blogArticles } from '../content/blog.js';
import { t } from '../i18n/i18n.js';

export function BlogArticlePage({ slug }: { slug: string }) {
  const meta = blogArticles.find((article)=>article.slug===slug);
  const [body,setBody]=useState<string|null>(null); const [error,setError]=useState(false);
  useEffect(()=>{ if(!meta){setError(true);return;} const c=new AbortController(); void fetch(`/content/blog/es/${encodeURIComponent(slug)}.md`,{signal:c.signal,credentials:'omit'}).then(r=>{if(!r.ok)throw new Error();return r.text();}).then(setBody).catch(()=>{if(!c.signal.aborted)setError(true);}); return()=>c.abort();},[meta,slug]);
  if(!meta||error)return <main className="v16-page"><h1>{t('blog.notFound')}</h1><a href="/blog">{t('blog.back')}</a></main>;
  return <main className="v16-page v16-article"><a href="/blog">← {t('blog.back')}</a><header><p className="eyebrow">{meta.kind} · {meta.date}</p><h1>{t(meta.titleKey)}</h1><p>{t(meta.excerptKey)}</p></header>{body?<MarkdownArticle markdown={body}/>:<p>{t('app.loading')}</p>}</main>;
}
