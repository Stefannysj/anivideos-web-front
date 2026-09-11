export interface HealthResponse {
  status: 'ok';
  service: 'anivideos-api';
}

export type ConnectionState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'available'; data: HealthResponse }
  | { status: 'unavailable' };

/** Valida la respuesta real de la API; los tipos solos no validan datos de red. */
export function parseHealthResponse(value: unknown): HealthResponse {
  if (
    typeof value !== 'object' || value === null ||
    !('status' in value) || value.status !== 'ok' ||
    !('service' in value) || value.service !== 'anivideos-api'
  ) {
    throw new Error('La API devolvio una respuesta inesperada.');
  }
  return { status: 'ok', service: 'anivideos-api' };
}
