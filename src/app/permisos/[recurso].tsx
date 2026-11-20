import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';

import { tema } from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';

export default function PermisoRoute() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const [permiso, pedirPermiso] = useCameraPermissions();
  const { estado, pedir, abrirAjustes } = usePermiso(permiso, pedirPermiso);
  const esCamara = recurso === 'camara';

  const continuar = async () => {
    const respuesta = await pedir();
    if (respuesta.granted) {
      router.replace('/escanear');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Permiso necesario' }} />
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>{esCamara ? 'Usar la cámara' : 'Permitir notificaciones'}</Text>
        <Text style={styles.descripcion}>
          {esCamara
            ? 'Usamos tu cámara para leer el código de barras del libro.'
            : 'Usamos tus notificaciones para avisarte antes de devolver un libro.'}
        </Text>
        {estado === 'cargando' && <Text style={styles.auxiliar}>Consultando permiso...</Text>}
        {estado === 'concedido' && <Text style={styles.auxiliar}>Permiso concedido.</Text>}
        {estado === 'bloqueado' ? (
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
        )}
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
