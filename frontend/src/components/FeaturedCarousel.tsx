import { useEffect, useRef, useState } from 'react';
import type { FeaturedBanner as FeaturedBannerModel } from '../models/banner.js';
import { wrapBannerIndex } from '../models/banner.js';
import { FeaturedBanner } from './FeaturedBanner.js';
import { Icon } from './Icon.js';

interface FeaturedCarouselProps {
  banners: readonly FeaturedBannerModel[];
}

/** Carrusel manual accesible: evita autoplay y permite navegación por botones, indicadores y teclado. */
export function FeaturedCarousel({ banners }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLElement | null>(null);
  const total = banners.length;

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return undefined;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveIndex((current) => wrapBannerIndex(current, -1, total));
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveIndex((current) => wrapBannerIndex(current, 1, total));
      }
    }

    carousel.addEventListener('keydown', handleKeyDown);
    return () => carousel.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  const activeBanner = banners[activeIndex];
  if (!activeBanner) throw new Error('AniVideos necesita al menos un banner destacado.');

  function changeBanner(offset: number): void {
    setActiveIndex((current) => wrapBannerIndex(current, offset, total));
  }

  return (
    <section
      className="featured-carousel"
      ref={carouselRef}
      aria-roledescription="carrusel"
      aria-label="Banners destacados"
    >
      <div className="featured-carousel__viewport">
        <FeaturedBanner
          banner={activeBanner}
          position={activeIndex + 1}
          total={total}
          key={activeBanner.id}
        />
      </div>

      <div className="featured-carousel__toolbar">
        <div className="featured-carousel__dots" aria-label="Seleccionar banner">
          {banners.map((banner, index) => (
            <button
              className={index === activeIndex ? 'carousel-dot carousel-dot--active' : 'carousel-dot'}
              type="button"
              key={banner.id}
              aria-label={`Mostrar ${banner.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <span />
            </button>
          ))}
        </div>

        <div className="featured-carousel__arrows">
          <button className="carousel-arrow" type="button" aria-label="Banner anterior" onClick={() => changeBanner(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <span className="featured-carousel__counter" aria-hidden="true">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <button className="carousel-arrow" type="button" aria-label="Banner siguiente" onClick={() => changeBanner(1)}>
            <Icon name="chevron-right" size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
