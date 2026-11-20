import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';

export default function PersonalRoute() {
  const { sesionPersonal } = useBiblioteca();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Personal de biblioteca</Text>
      <Text style={styles.texto}>
        {sesionPersonal ? 'Sesión activa.' : 'Ingresá para gestionar las entregas.'}
      </Text>
      <Link href={sesionPersonal ? '/mostrador' : '/login'} style={styles.link}>
        {sesionPersonal ? 'Abrir mostrador' : 'Ingresar'}
      </Link>
    </View>
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
    fontSize: 24,
    fontWeight: '800',
  },
  texto: {
    color: tema.colores.textoSecundario,
    textAlign: 'center',
  },
  link: {
    color: tema.colores.primario,
    fontWeight: '700',
  },
});
