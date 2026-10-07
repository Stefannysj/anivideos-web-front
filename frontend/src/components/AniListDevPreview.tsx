import { useEffect, useState } from 'react';
import { t } from '../i18n/i18n.js';
import { getAniListDevPreview } from '../services/anilist-dev.service.js';
import type { AniListDevItem } from '../services/anilist-dev.service.js';

type State =
  | { status: 'loading'; items: AniListDevItem[] }
  | { status: 'ready'; items: AniListDevItem[] }
  | { status: 'error'; items: AniListDevItem[] };

/** Diagnostic UI shown only in Vite development mode when the backend is unavailable. */
export function AniListDevPreview() {
  const [state, setState] = useState<State>({ status: 'loading', items: [] });

  useEffect(() => {
    const controller = new AbortController();
    void getAniListDevPreview(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setState({ status: 'ready', items });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'error', items: [] });
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="anilist-dev" aria-live="polite">
      <header className="anilist-dev__header">
        <div>
          <p className="eyebrow">{t('dev.anilist.title')}</p>
          <p>{t('dev.anilist.body')}</p>
        </div>
        <a href="https://anilist.co" target="_blank" rel="noreferrer">AniList</a>
      </header>

      {state.status === 'loading' && <p className="anilist-dev__state">{t('dev.anilist.loading')}</p>}
      {state.status === 'error' && <p className="anilist-dev__state" role="alert">{t('dev.anilist.error')}</p>}
      {state.status === 'ready' && (
        <div className="anilist-dev__grid">
          {state.items.map((item) => (
            <article className="anilist-dev__card" key={item.id}>
              <img src={item.coverImage} alt="" width="230" height="325" loading="lazy" decoding="async" />
              <div>
                <h2>{item.title}</h2>
                <p>{[item.year, item.score === null ? null : `${t('dev.anilist.score')}: ${item.score.toFixed(1)}`].filter(Boolean).join(' · ')}</p>
                <p>{item.genres.join(' · ')}</p>
                <a href={item.siteUrl} target="_blank" rel="noreferrer">{t('dev.anilist.open')}</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
