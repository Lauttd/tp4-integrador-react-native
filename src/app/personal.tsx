import { StyleSheet, Text, View } from 'react-native';

import { tema } from '../constants/tema';

export default function PersonalRoute() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.texto}>Acceso de personal próximamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tema.espacios.lg,
    backgroundColor: tema.colores.fondo,
  },
  texto: {
    color: tema.colores.textoSecundario,
    textAlign: 'center',
  },
});
