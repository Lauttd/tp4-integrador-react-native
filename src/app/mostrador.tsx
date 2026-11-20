import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';

export default function MostradorRoute() {
  const {
    libros,
    esperas,
    entregarAlSiguiente,
    cerrarSesion,
    agregarAviso,
  } = useBiblioteca();
  const [mensaje, setMensaje] = useState('');
  const filas = Object.entries(esperas).filter(([, personas]) => personas.length > 0);

  const entregar = async (isbn: string) => {
    const persona = entregarAlSiguiente(isbn);
    if (!persona) {
      setMensaje('No hay personas esperando este libro.');
      return;
    }

    if (persona.nombre === 'Lautaro') {
      const permiso = await Notifications.getPermissionsAsync();
      if (permiso.granted) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Tu reserva está lista',
            body: 'Podés retirar tu libro en el mostrador.',
          },
          trigger: null,
        });
      } else {
        agregarAviso('Tu reserva está lista para retirar en el mostrador.');
      }
    }
    setMensaje(`Se entregó el siguiente turno de ${libros.find((libro) => libro.isbn === isbn)?.titulo ?? isbn}.`);
  };

  const salir = () => {
    cerrarSesion();
    router.replace('/');
  };

  return (
    <FlatList
      contentContainerStyle={styles.lista}
      data={filas}
      keyExtractor={([isbn]) => isbn}
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Mostrador</Text>
          <Text style={styles.subtitulo}>Gestioná las listas de espera por orden de llegada.</Text>
          {mensaje && <Text style={styles.mensaje}>{mensaje}</Text>}
        </View>
      }
      ListEmptyComponent={<Text style={styles.vacio}>No hay personas en lista de espera.</Text>}
      ListFooterComponent={
        <Pressable accessibilityRole="button" style={styles.botonSecundario} onPress={salir}>
          <Text style={styles.textoSecundario}>Cerrar sesión</Text>
        </Pressable>
      }
      renderItem={({ item: [isbn, personas] }) => {
        const libro = libros.find((actual) => actual.isbn === isbn);
        const siguiente = personas[0];
        return (
          <View style={styles.tarjeta}>
            <Text style={styles.libro}>{libro?.titulo ?? isbn}</Text>
            <Text style={styles.detalle}>Frente: {siguiente.nombre}</Text>
            <Text style={styles.detalle}>Personas esperando: {personas.length}</Text>
            <Pressable
              accessibilityRole="button"
              style={styles.boton}
              onPress={() => {
                void entregar(isbn);
              }}>
              <Text style={styles.textoBoton}>Entregar al siguiente</Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
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
  },
  mensaje: {
    color: tema.colores.exito,
  },
  vacio: {
    color: tema.colores.textoSecundario,
  },
  tarjeta: {
    gap: tema.espacios.sm,
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
  boton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tema.radios.sm,
    backgroundColor: tema.colores.primario,
  },
  textoBoton: {
    color: tema.colores.superficie,
    fontWeight: '700',
  },
  botonSecundario: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tema.radios.sm,
    backgroundColor: tema.colores.primarioClaro,
  },
  textoSecundario: {
    color: tema.colores.primario,
    fontWeight: '700',
  },
});
