import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { tema } from '../../constants/tema';

export default function ReservarRoute() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.texto}>Confirmación de reserva para {isbn}</Text>
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
    color: tema.colores.texto,
    textAlign: 'center',
  },
});
