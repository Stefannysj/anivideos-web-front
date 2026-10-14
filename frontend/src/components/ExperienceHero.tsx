import { useState } from 'react';
import { t } from '../i18n/i18n.js';
import { Icon } from './Icon.js';

const slides = [
  { title: 'Stellar Pulse', artwork: '/banners/stellar-pulse.svg', index: '01' },
  { title: 'Red Horizon', artwork: '/banners/red-horizon.svg', index: '02' },
  { title: 'Signal Zero', artwork: '/banners/signal-zero.svg', index: '03' },
  { title: 'Seoul After Rain', artwork: '/banners/seoul-after-rain.svg', index: '04' },
] as const;

export function ExperienceHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = slides[activeIndex] ?? slides[0];

  return (
    <section className="experience-hero" aria-roledescription={t('banner.carousel')} aria-label={t('banner.featured')}>
      <div className="experience-hero__stage">
        <img className="experience-hero__artwork" src={active.artwork} alt="" width="1600" height="900" fetchPriority="high" />
        <div className="experience-hero__veil" aria-hidden="true" />
        <div className="experience-hero__glow" aria-hidden="true" />

        <div className="experience-hero__content">
          <div className="experience-hero__kicker">
            <span className="experience-hero__live-dot" aria-hidden="true" />
            <span>{t('home.overview.eyebrow')}</span>
          </div>
          <p className="experience-hero__number">{active.index} / 04</p>
          <h1>{active.title}</h1>
          <p className="experience-hero__description">{t('home.overview.body')}</p>
          <div className="experience-hero__actions">
            <a className="button button--primary" href="#catalogo">
              <Icon name="search" size={18} />
              {t('nav.catalog')}
            </a>
            <a className="button button--glass" href="https://anilist.co" target="_blank" rel="noreferrer">
              {t('source.anilist')}
              <Icon name="arrow-right" size={17} />
            </a>
          </div>
        </div>

        <div className="experience-hero__meter" aria-hidden="true">
          <span style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }} />
        </div>
      </div>

      <aside className="experience-hero__rail">
        <div className="experience-hero__rail-title">
          <div>
            <p className="eyebrow">AniVideos</p>
            <strong>{t('banner.featured')}</strong>
          </div>
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        </div>

        <div className="experience-hero__slides">
          {slides.map((slide, index) => (
            <button
              className={index === activeIndex ? 'experience-slide experience-slide--active' : 'experience-slide'}
              type="button"
              key={slide.title}
              aria-label={t('banner.show', { title: slide.title })}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <img src={slide.artwork} alt="" width="220" height="124" loading={index === 0 ? 'eager' : 'lazy'} />
              <span className="experience-slide__copy">
                <small>{slide.index}</small>
                <strong>{slide.title}</strong>
              </span>
              <Icon name="arrow-right" size={17} />
            </button>
          ))}
        </div>

        <div className="experience-hero__rail-actions">
          <button className="carousel-arrow" type="button" aria-label={t('banner.previous')} onClick={() => setActiveIndex((value) => (value + slides.length - 1) % slides.length)}>
            <Icon name="chevron-left" size={20} />
          </button>
          <button className="carousel-arrow" type="button" aria-label={t('banner.next')} onClick={() => setActiveIndex((value) => (value + 1) % slides.length)}>
            <Icon name="chevron-right" size={20} />
          </button>
        </div>
      </aside>
    </section>
  );
}
