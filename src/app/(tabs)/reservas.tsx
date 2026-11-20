import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useBiblioteca } from '../../context/BibliotecaContext';
import { tema } from '../../constants/tema';
import { pedirPermisoNotificaciones, programarRecordatorio, cancelarRecordatorio } from '../../lib/notificaciones';

export default function ReservasRoute() {
  const {
    prestamos,
    reservasEnEspera,
    libros,
    devolver,
    alternarRecordatorio,
    avisos,
    agregarAviso,
  } = useBiblioteca();
  const [procesando, setProcesando] = useState<string | null>(null);

  const alternar = async (isbn: string, activo: boolean) => {
    const prestamo = prestamos.find((actual) => actual.isbn === isbn);
    if (!prestamo) {
      return;
    }

    setProcesando(isbn);
    try {
      if (!activo) {
        if (prestamo.identificadorNotificacion) {
          await cancelarRecordatorio(prestamo.identificadorNotificacion);
        }
        alternarRecordatorio(isbn, false);
        return;
      }

      const permitido = await pedirPermisoNotificaciones();
      if (!permitido) {
        agregarAviso(`No se activó el recordatorio de ${libros.find((libro) => libro.isbn === isbn)?.titulo ?? isbn}.`);
        return;
      }

      const titulo = libros.find((libro) => libro.isbn === isbn)?.titulo ?? isbn;
      const identificador = await programarRecordatorio(titulo);
      alternarRecordatorio(isbn, true, identificador);
    } catch {
      agregarAviso('No se pudo activar el recordatorio. Podés seguir usando la app sin notificaciones.');
    } finally {
      setProcesando(null);
    }
  };

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
            <View style={styles.acciones}>
              <Text style={styles.detalle}>Recordarme</Text>
              <Switch
                accessibilityLabel="Activar recordatorio de devolución"
                value={item.recordatorioActivo}
                disabled={procesando === item.isbn}
                onValueChange={(activo) => {
                  void alternar(item.isbn, activo);
                }}
              />
              <Pressable
                accessibilityRole="button"
                style={styles.botonDevolver}
                onPress={() => {
                  void devolver(item.isbn);
                }}>
                <Text style={styles.textoDevolver}>Devolver</Text>
              </Pressable>
            </View>
          </View>
        );
      }}
      ListFooterComponent={
        <View style={styles.pie}>
          {reservasEnEspera.length > 0 && (
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
          )}
          <View style={styles.espera}>
            <Text style={styles.seccion}>Avisos</Text>
            {avisos.length === 0 ? (
              <Text style={styles.detalle}>No tenés avisos pendientes.</Text>
            ) : (
              avisos.map((aviso, indice) => (
                <Text key={`${aviso}-${indice}`} style={styles.detalle}>
                  {aviso}
                </Text>
              ))
            )}
          </View>
        </View>
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
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espacios.sm,
    marginTop: tema.espacios.sm,
  },
  botonDevolver: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: tema.espacios.sm,
    borderRadius: tema.radios.sm,
    backgroundColor: tema.colores.primarioClaro,
  },
  textoDevolver: {
    color: tema.colores.primario,
    fontWeight: '700',
  },
  espera: {
    gap: tema.espacios.sm,
  },
  pie: {
    gap: tema.espacios.lg,
    marginTop: tema.espacios.md,
  },
});
