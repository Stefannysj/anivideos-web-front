import type { FeaturedBanner } from '../models/banner.js';

/**
 * Contenido ficticio y arte local para desarrollar la experiencia sin depender de material protegido
 * ni realizar solicitudes a servicios externos durante esta etapa.
 */
export const featuredBanners = [
  {
    id: 'stellar-pulse',
    category: 'Anime',
    eyebrow: 'AniVideos · Selección destacada',
    title: 'Stellar Pulse',
    synopsis: 'Una tripulación de cadetes cruza una frontera estelar mientras intenta descifrar una señal que parece conocer sus recuerdos.',
    year: 2026,
    ageRating: '13+',
    format: '12 episodios',
    genres: ['Ciencia ficción', 'Aventura', 'Drama'],
    artwork: '/banners/stellar-pulse.svg',
    sectionHref: '#anime',
  },
  {
    id: 'seoul-after-rain',
    category: 'K-Drama',
    eyebrow: 'AniVideos · Historia de la semana',
    title: 'Seoul After Rain',
    synopsis: 'Dos desconocidos comparten el último tren de la noche y descubren que sus vidas llevan años cruzándose sin que lo supieran.',
    year: 2026,
    ageRating: '13+',
    format: '16 episodios',
    genres: ['Romance', 'Drama', 'Misterio'],
    artwork: '/banners/seoul-after-rain.svg',
    sectionHref: '#k-dramas',
  },
  {
    id: 'signal-zero',
    category: 'Serie',
    eyebrow: 'AniVideos · Nuevo misterio',
    title: 'Signal Zero',
    synopsis: 'Una operadora nocturna recibe transmisiones de una estación abandonada y encuentra una pista sobre un caso cerrado hace veinte años.',
    year: 2026,
    ageRating: '16+',
    format: '8 episodios',
    genres: ['Thriller', 'Misterio', 'Suspenso'],
    artwork: '/banners/signal-zero.svg',
    sectionHref: '#series',
  },
  {
    id: 'red-horizon',
    category: 'Película',
    eyebrow: 'AniVideos · Estreno ficticio',
    title: 'Red Horizon',
    synopsis: 'Una piloto debe atravesar un planeta en evacuación antes de que una tormenta orbital borre la última ruta de salida.',
    year: 2026,
    ageRating: '13+',
    format: '2 h 08 min',
    genres: ['Aventura', 'Ciencia ficción'],
    artwork: '/banners/red-horizon.svg',
    sectionHref: '#peliculas',
  },
] as const satisfies readonly FeaturedBanner[];
