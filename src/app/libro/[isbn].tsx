import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';

import { useBiblioteca } from '../../context/BibliotecaContext';
import { tema } from '../../constants/tema';
import { esIsbnValido } from '../../lib/catalogo';

export default function DetalleLibroRoute() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { libros, disponiblesDe, esperas, registrarReciente } = useBiblioteca();
  const libro = esIsbnValido(isbn) ? libros.find((actual) => actual.isbn === isbn) : undefined;
  const personasEnEspera = libro ? esperas[libro.isbn]?.length ?? 0 : 0;

  useEffect(() => {
    if (libro) {
      registrarReciente(libro);
    }
  }, [libro, registrarReciente]);

  return (
    <>
      <Stack.Screen options={{ title: libro?.titulo ?? 'Libro no encontrado' }} />
      {libro ? (
        <View style={styles.contenedor}>
          <Text style={styles.titulo}>{libro.titulo}</Text>
          <Text style={styles.autor}>{libro.autor}</Text>
          <Text style={styles.detalle}>Año de publicación: {libro.anio}</Text>
          <Text style={styles.detalle}>Ejemplares disponibles: {disponiblesDe(libro.isbn)}</Text>
          <Text style={styles.detalle}>Personas en lista de espera: {personasEnEspera}</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.boton}
            onPress={() => {
              router.push(`/reservar/${libro.isbn}`);
            }}>
            <Text style={styles.textoBoton}>Reservar</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.contenedor}>
          <Text style={styles.titulo}>No encontramos ese libro</Text>
          <Text style={styles.detalle}>El ISBN ingresado no es válido o no pertenece al catálogo.</Text>
          <Link href="/" style={styles.link}>
            Volver al catálogo
          </Link>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    gap: tema.espacios.md,
    padding: tema.espacios.md,
    backgroundColor: tema.colores.fondo,
  },
  titulo: {
    color: tema.colores.texto,
    fontSize: 26,
    fontWeight: '800',
  },
  autor: {
    color: tema.colores.primario,
    fontSize: 18,
    fontWeight: '600',
  },
  detalle: {
    color: tema.colores.textoSecundario,
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    color: tema.colores.primario,
    fontWeight: '700',
  },
});
