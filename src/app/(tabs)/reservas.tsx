import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useBiblioteca } from '../../context/BibliotecaContext';
import { tema } from '../../constants/tema';

export default function ReservasRoute() {
  const { prestamos, reservasEnEspera, libros } = useBiblioteca();

  return (
    <FlatList
      contentContainerStyle={styles.contenedor}
      data={prestamos}
      keyExtractor={(prestamo) => prestamo.isbn}
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Mis reservas</Text>
          <Text style={styles.subtitulo}>Tus préstamos y lugares en lista de espera.</Text>
          <Text style={styles.seccion}>Préstamos activos</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.vacio}>Todavía no tenés préstamos activos.</Text>}
      renderItem={({ item }) => {
        const libro = libros.find((actual) => actual.isbn === item.isbn);
        return (
          <View style={styles.tarjeta}>
            <Text style={styles.libro}>{libro?.titulo ?? item.isbn}</Text>
            <Text style={styles.detalle}>Devolución: {item.fechaDevolucion}</Text>
          </View>
        );
      }}
      ListFooterComponent={
        reservasEnEspera.length > 0 ? (
          <View style={styles.espera}>
            <Text style={styles.seccion}>Lista de espera</Text>
            {reservasEnEspera.map((reserva) => {
              const libro = libros.find((actual) => actual.isbn === reserva.isbn);
              return (
                <Text key={reserva.isbn} style={styles.detalle}>
                  {libro?.titulo ?? reserva.isbn}: posición {reserva.posicion}
                </Text>
              );
            })}
          </View>
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    gap: tema.espacios.md,
    padding: tema.espacios.md,
    backgroundColor: tema.colores.fondo,
  },
  encabezado: {
    gap: tema.espacios.sm,
  },
  titulo: {
    color: tema.colores.texto,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitulo: {
    color: tema.colores.textoSecundario,
    fontSize: 15,
  },
  seccion: {
    color: tema.colores.texto,
    fontSize: 18,
    fontWeight: '700',
    marginTop: tema.espacios.md,
  },
  vacio: {
    color: tema.colores.textoSecundario,
  },
  tarjeta: {
    gap: tema.espacios.xs,
    padding: tema.espacios.md,
    borderRadius: tema.radios.md,
    backgroundColor: tema.colores.superficie,
    borderWidth: 1,
    borderColor: tema.colores.borde,
  },
  libro: {
    color: tema.colores.texto,
    fontWeight: '700',
  },
  detalle: {
    color: tema.colores.textoSecundario,
  },
  espera: {
    gap: tema.espacios.sm,
  },
});
