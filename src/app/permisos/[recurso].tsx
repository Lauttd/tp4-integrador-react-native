import { useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';

import { tema } from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';
import { pedirPermisoNotificaciones } from '../../lib/notificaciones';
import { recursoPermisoValido } from '../../lib/permisos';

export default function PermisoRoute() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const recursoValido = recursoPermisoValido(recurso);
  const esCamara = recursoValido && recurso === 'camara';
  const esNotificaciones = recursoValido && recurso === 'notificaciones';
  const [permisoCamara, pedirPermisoCamara] = useCameraPermissions();
  const [permisoNotificaciones, setPermisoNotificaciones] = useState<{
    granted: boolean;
    canAskAgain: boolean;
  } | null>(null);
  const [errorPermiso, setErrorPermiso] = useState('');

  useEffect(() => {
    if (esCamara || !esNotificaciones) {
      return;
    }

    const actualizar = async () => {
      try {
        const respuesta = await Notifications.getPermissionsAsync();
        setPermisoNotificaciones({
          granted: respuesta.granted,
          canAskAgain: respuesta.canAskAgain,
        });
      } catch {
        setPermisoNotificaciones({ granted: false, canAskAgain: true });
        setErrorPermiso('No se pudo consultar el permiso de notificaciones.');
      }
    };

    void actualizar();
    const subscription = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') {
        void actualizar();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [esCamara, esNotificaciones]);

  const pedirPermisoActivo = esCamara
    ? pedirPermisoCamara
    : async () => {
        const concedido = await pedirPermisoNotificaciones();
        const respuesta = await Notifications.getPermissionsAsync();
        return {
          granted: concedido,
          canAskAgain: respuesta.canAskAgain,
        };
      };

  const permisoActivo = esCamara ? permisoCamara : permisoNotificaciones;
  const { estado, pedir, abrirAjustes } = usePermiso(permisoActivo, pedirPermisoActivo);

  const continuar = async () => {
    try {
      const respuesta = await pedir();
      if (respuesta.granted) {
        router.replace(esCamara ? '/escanear' : '/reservas');
      }
    } catch {
      setErrorPermiso(
        esCamara
          ? 'No se pudo consultar el permiso de cámara.'
          : 'No se pudo consultar el permiso de notificaciones.',
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Permiso necesario' }} />
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>
          {!recursoValido
            ? 'Recurso no disponible'
            : esCamara
              ? 'Usar la cámara'
              : 'Permitir notificaciones'}
        </Text>
        <Text style={styles.descripcion}>
          {!recursoValido
            ? 'Ese recurso no está disponible en la Biblioteca IPF.'
            : esCamara
              ? 'Usamos tu cámara para leer el código de barras del libro.'
              : 'Usamos tus notificaciones para avisarte antes de devolver un libro.'}
        </Text>
        {recursoValido && estado === 'cargando' && <Text style={styles.auxiliar}>Consultando permiso...</Text>}
        {recursoValido && estado === 'concedido' && <Text style={styles.auxiliar}>Permiso concedido.</Text>}
        {errorPermiso && <Text style={styles.error}>{errorPermiso}</Text>}
        {recursoValido &&
          (estado === 'bloqueado' ? (
            <Pressable accessibilityRole="button" style={styles.boton} onPress={abrirAjustes}>
              <Text style={styles.textoBoton}>Abrir Ajustes</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              style={styles.boton}
              onPress={continuar}
              disabled={estado === 'cargando' || estado === 'concedido'}>
              <Text style={styles.textoBoton}>Continuar</Text>
            </Pressable>
          ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    gap: tema.espacios.md,
    padding: tema.espacios.lg,
    backgroundColor: tema.colores.fondo,
  },
  titulo: {
    color: tema.colores.texto,
    fontSize: 24,
    fontWeight: '800',
  },
  descripcion: {
    color: tema.colores.textoSecundario,
    fontSize: 16,
    lineHeight: 24,
  },
  auxiliar: {
    color: tema.colores.textoSecundario,
  },
  error: {
    color: tema.colores.error,
  },
  boton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tema.radios.sm,
    backgroundColor: tema.colores.primario,
  },
  textoBoton: {
    color: tema.colores.superficie,
    fontWeight: '700',
  },
});
