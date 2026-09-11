type IconName = 'menu' | 'close' | 'user' | 'arrow-right';

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

  if (name === 'menu') {
    return (
      <svg {...commonProps}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  }

  if (name === 'close') {
    return (
      <svg {...commonProps}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }

  if (name === 'user') {
    return (
      <svg {...commonProps}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
