import { useCallback } from 'react';
import * as Linking from 'expo-linking';

import { estadoPermiso, type EstadoPermiso } from '../lib/permisos';

type RespuestaPermiso = {
  granted: boolean;
  canAskAgain: boolean;
};

type UsePermisoResult = {
  estado: EstadoPermiso;
  pedir: () => Promise<RespuestaPermiso>;
  abrirAjustes: () => Promise<void>;
};

export function usePermiso(
  permiso: RespuestaPermiso | null,
  pedirPermiso: () => Promise<RespuestaPermiso>,
): UsePermisoResult {
  const pedir = useCallback(() => pedirPermiso(), [pedirPermiso]);
  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  return {
    estado: estadoPermiso(permiso),
    pedir,
    abrirAjustes,
  };
}
