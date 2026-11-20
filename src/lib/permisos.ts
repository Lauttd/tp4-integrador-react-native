export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

type RespuestaPermiso = {
  granted: boolean;
  canAskAgain: boolean;
};

export function estadoPermiso(permiso: RespuestaPermiso | null): EstadoPermiso {
  if (!permiso) {
    return 'cargando';
  }
  if (permiso.granted) {
    return 'concedido';
  }
  return permiso.canAskAgain ? 'preguntable' : 'bloqueado';
}
