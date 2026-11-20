import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { tema } from '../constants/tema';
import type { Libro } from '../types';

type TarjetaLibroProps = {
  libro: Libro;
  disponibles: number;
  onAbrir: (libro: Libro) => void;
};

export function TarjetaLibro({ libro, disponibles, onAbrir }: TarjetaLibroProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
      onPress={() => {
        onAbrir(libro);
        router.push(`/libro/${libro.isbn}`);
      }}>
      <View style={styles.contenido}>
        <Text style={styles.titulo}>{libro.titulo}</Text>
        <Text style={styles.autor}>{libro.autor}</Text>
        <Text style={styles.estado}>
          {disponibles > 0 ? `${disponibles} disponible${disponibles === 1 ? '' : 's'}` : 'Sin ejemplares'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    minHeight: 88,
    marginBottom: tema.espacios.sm,
    padding: tema.espacios.md,
    borderRadius: tema.radios.md,
    backgroundColor: tema.colores.superficie,
    borderWidth: 1,
    borderColor: tema.colores.borde,
  },
  presionada: {
    opacity: 0.7,
  },
  contenido: {
    gap: tema.espacios.xs,
  },
  titulo: {
    color: tema.colores.texto,
    fontSize: 17,
    fontWeight: '700',
  },
  autor: {
    color: tema.colores.textoSecundario,
    fontSize: 14,
  },
  estado: {
    color: tema.colores.primario,
    fontSize: 13,
    fontWeight: '600',
  },
});
