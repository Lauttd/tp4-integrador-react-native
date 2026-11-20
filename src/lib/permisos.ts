export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';
export type RecursoPermiso = 'camara' | 'notificaciones';

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

export function recursoPermisoValido(recurso: string): recurso is RecursoPermiso {
  return recurso === 'camara' || recurso === 'notificaciones';
}
