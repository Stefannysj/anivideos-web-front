import type { ReactNode } from 'react';

interface FoundationPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/** Superficie base para agrupar contenido manteniendo espaciado y jerarquia visual consistentes. */
export function FoundationPanel({ eyebrow, title, description, children }: FoundationPanelProps) {
  return (
    <section className="surface-card">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  );
}
