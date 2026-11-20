import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { tema } from '../constants/tema';

type EstadoCatalogoProps = {
  cargando: boolean;
  error: string | null;
  vacio: boolean;
  onReintentar: () => void;
};

export function EstadoCatalogo({
  cargando,
  error,
  vacio,
  onReintentar,
}: EstadoCatalogoProps) {
  if (cargando) {
    return (
      <View style={styles.contenedor}>
        <ActivityIndicator size="large" color={tema.colores.primario} />
        <Text style={styles.texto}>Cargando el catálogo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.texto}>{error}</Text>
        <Pressable accessibilityRole="button" style={styles.boton} onPress={onReintentar}>
          <Text style={styles.textoBoton}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (vacio) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.texto}>No hay libros disponibles en el catálogo.</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: tema.espacios.md,
    padding: tema.espacios.xl,
  },
  texto: {
    color: tema.colores.textoSecundario,
    fontSize: 16,
    textAlign: 'center',
  },
  boton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: tema.espacios.lg,
    borderRadius: tema.radios.sm,
    backgroundColor: tema.colores.primario,
  },
  textoBoton: {
    color: tema.colores.superficie,
    fontWeight: '700',
  },
});
