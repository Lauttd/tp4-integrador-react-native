import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, Stack, useLocalSearchParams, router } from 'expo-router';

import { useBiblioteca } from '../../context/BibliotecaContext';
import { tema } from '../../constants/tema';
import { esIsbnValido } from '../../lib/catalogo';

export default function ReservarRoute() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { libros, disponiblesDe, reservar } = useBiblioteca();
  const libro = esIsbnValido(isbn) ? libros.find((actual) => actual.isbn === isbn) : undefined;

  return (
    <>
      <Stack.Screen options={{ title: 'Confirmar reserva' }} />
      <View style={styles.contenedor}>
        {libro ? (
          <>
            <Text style={styles.titulo}>¿Querés reservar “{libro.titulo}”?</Text>
            <Text style={styles.detalle}>
              {disponiblesDe(libro.isbn) > 0
                ? 'Se generará un préstamo por 7 días.'
                : 'No hay ejemplares. Vas a ingresar a la lista de espera.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              style={styles.boton}
              onPress={() => {
                reservar(libro.isbn);
                router.replace('/reservas');
              }}>
              <Text style={styles.textoBoton}>Confirmar</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.titulo}>No se puede reservar este libro</Text>
            <Link href="/" style={styles.link}>
              Volver al catálogo
            </Link>
          </>
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
    fontSize: 22,
    fontWeight: '700',
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
    fontWeight: '700',
  },
  link: {
    color: tema.colores.primario,
    fontWeight: '700',
  },
});
