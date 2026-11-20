import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { tema } from '../constants/tema';

export default function NotFoundRoute() {
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>No encontramos esta pantalla</Text>
        <Text style={styles.url}>{pathname}</Text>
        <Link href="/" style={styles.link}>
          Volver al catálogo
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tema.espacios.md,
    padding: tema.espacios.lg,
    backgroundColor: tema.colores.fondo,
  },
  titulo: {
    color: tema.colores.texto,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  url: {
    color: tema.colores.textoSecundario,
  },
  link: {
    color: tema.colores.primario,
    fontWeight: '700',
  },
});
