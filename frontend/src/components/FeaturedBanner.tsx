import { t } from '../i18n/i18n.js';
import type { FeaturedBanner as FeaturedBannerModel } from '../models/banner.js';
import { Icon } from './Icon.js';

interface Props { banner: FeaturedBannerModel; position: number; total: number; onCommentsOpen: () => void; }

export function FeaturedBanner({ banner, position, total, onCommentsOpen }: Props) {
  return (
    <article className="featured-banner" aria-label={`${banner.title}, ${position} / ${total}`}>
      <img className="featured-banner__artwork" src={banner.artwork} alt="" width="1600" height="900" decoding="async" fetchPriority="high" />
      <div className="featured-banner__scrim" aria-hidden="true" />
      <div className="featured-banner__content">
        <p className="featured-banner__eyebrow">{banner.eyebrow}</p><p className="featured-banner__category">{banner.category}</p><h1>{banner.title}</h1>
        <div className="featured-banner__metadata"><span>{banner.year}</span><span>{banner.ageRating}</span><span>{banner.format}</span></div>
        <p className="featured-banner__synopsis">{banner.synopsis}</p>
        <ul className="featured-banner__genres">{banner.genres.map((g)=><li key={g}>{g}</li>)}</ul>
        <div className="featured-banner__actions">
          <a className="button button--primary" href={banner.sectionHref}><Icon name="play" size={18}/>{t('banner.explore')} {banner.category}</a>
          <button className="button button--glass" type="button" onClick={onCommentsOpen}><Icon name="message" size={18}/>{t('banner.comments')}</button>
          <a className="button button--glass" href={`/contenido/${banner.contentId}`}><Icon name="info" size={19}/>{t('banner.details')}</a>
        </div>
        <p className="featured-banner__demo-note">{banner.sourceAttribution}</p>
      </div>
    </article>
  );
}
