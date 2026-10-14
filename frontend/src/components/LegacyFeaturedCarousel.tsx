import { useState } from 'react';
import { t } from '../i18n/i18n.js';
import { Icon } from './Icon.js';

const banners = [
  { title: 'Stellar Pulse', artwork: '/banners/stellar-pulse.svg' },
  { title: 'Red Horizon', artwork: '/banners/red-horizon.svg' },
  { title: 'Seoul After Rain', artwork: '/banners/seoul-after-rain.svg' },
  { title: 'Signal Zero', artwork: '/banners/signal-zero.svg' },
] as const;

export function LegacyFeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = banners[activeIndex] ?? banners[0];

  function move(offset: number): void {
    setActiveIndex((current) => (current + offset + banners.length) % banners.length);
  }

  return (
    <section className="legacy-hero" aria-roledescription={t('banner.carousel')} aria-label={t('banner.featured')}>
      <img className="legacy-hero__artwork" src={active.artwork} alt="" width="1600" height="900" fetchPriority="high" />
      <div className="legacy-hero__scrim" aria-hidden="true" />
      <div className="legacy-hero__content">
        <p className="eyebrow">{t('home.overview.eyebrow')}</p>
        <h1>{active.title}</h1>
        <p>{t('home.overview.body')}</p>
        <div className="legacy-hero__actions">
          <a className="button button--primary" href="#catalogo">
            <Icon name="search" size={18} />
            {t('catalog.search.title')}
          </a>
          <a className="button button--glass" href="https://anilist.co" target="_blank" rel="noreferrer">
            {t('source.anilist')}
          </a>
        </div>
      </div>

      <div className="legacy-hero__controls">
        <button className="carousel-arrow" type="button" aria-label={t('banner.previous')} onClick={() => move(-1)}>
          <Icon name="chevron-left" size={22} />
        </button>
        <div className="legacy-hero__dots" aria-label={t('banner.select')}>
          {banners.map((banner, index) => (
            <button
              className={index === activeIndex ? 'carousel-dot carousel-dot--active' : 'carousel-dot'}
              type="button"
              key={banner.title}
              aria-label={t('banner.show', { title: banner.title })}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <button className="carousel-arrow" type="button" aria-label={t('banner.next')} onClick={() => move(1)}>
          <Icon name="chevron-right" size={22} />
        </button>
      </div>
    </section>
  );
}
