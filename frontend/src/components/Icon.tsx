type IconName = 'search' | 'menu' | 'close' | 'user' | 'heart' | 'message' | 'trash' | 'arrow-right' | 'chevron-left' | 'chevron-right' | 'play' | 'info';

interface IconProps {
  name: IconName;
  size?: number;
}

/** Iconos SVG locales para evitar dependencias externas y mantener el control del peso visual. */
export function Icon({ name, size = 20 }: IconProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  if (name === 'search') return <svg {...commonProps}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>;
  if (name === 'menu') return <svg {...commonProps}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === 'close') return <svg {...commonProps}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'user') return <svg {...commonProps}><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>;
  if (name === 'heart') return <svg {...commonProps}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>;
  if (name === 'message') return <svg {...commonProps}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /><path d="M8 9h8M8 13h5" /></svg>;
  if (name === 'trash') return <svg {...commonProps}><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>;
  if (name === 'chevron-left') return <svg {...commonProps}><path d="m15 18-6-6 6-6" /></svg>;
  if (name === 'chevron-right') return <svg {...commonProps}><path d="m9 18 6-6-6-6" /></svg>;
  if (name === 'play') return <svg {...commonProps} fill="currentColor" stroke="none"><path d="M8.3 5.1a1 1 0 0 0-1.55.84v12.12a1 1 0 0 0 1.55.84l8.75-6.06a1 1 0 0 0 0-1.68L8.3 5.1Z" /></svg>;
  if (name === 'info') return <svg {...commonProps}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>;

  return <svg {...commonProps}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
