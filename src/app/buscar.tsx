import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { tema } from '../constants/tema';
import { buscarLibros } from '../lib/api';
import { normalizarConsulta } from '../lib/catalogo';
import type { Libro } from '../types';

export default function BuscarRoute() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const consulta = normalizarConsulta(q);
  const [texto, setTexto] = useState(consulta);
  const [resultados, setResultados] = useState<Libro[]>([]);
  const [buscando, setBuscando] = useState(Boolean(consulta));

  useEffect(() => {
    let activa = true;

    Promise.resolve().then(() => {
      if (!consulta) {
        if (activa) {
          setResultados([]);
          setBuscando(false);
        }
        return;
      }

      buscarLibros(consulta)
        .then((libros) => {
          if (activa) {
            setResultados(libros);
          }
        })
        .catch(() => {
          if (activa) {
            setResultados([]);
          }
        })
        .finally(() => {
          if (activa) {
            setBuscando(false);
          }
        });
    });

    return () => {
      activa = false;
    };
  }, [consulta]);

  return (
    <FlatList
      contentContainerStyle={styles.lista}
      data={resultados}
      keyExtractor={(libro) => libro.isbn}
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <TextInput
            accessibilityLabel="Buscar por título o autor"
            placeholder="Título o autor"
            placeholderTextColor={tema.colores.textoSecundario}
            style={styles.input}
            value={texto}
            onChangeText={(valor) => {
              setTexto(valor);
              setBuscando(Boolean(valor.trim()));
              router.setParams({ q: valor });
            }}
          />
          {buscando && <Text style={styles.auxiliar}>Buscando...</Text>}
          {!buscando && consulta && resultados.length === 0 && (
            <Text style={styles.auxiliar}>No encontramos libros con esa búsqueda.</Text>
          )}
        </View>
      }
      ListEmptyComponent={!buscando && !consulta ? <Text style={styles.auxiliar}>Escribí un título o autor.</Text> : undefined}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          style={styles.tarjeta}
          onPress={() => router.push(`/libro/${item.isbn}`)}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.autor}>{item.autor}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flexGrow: 1,
    gap: tema.espacios.sm,
    padding: tema.espacios.md,
    backgroundColor: tema.colores.fondo,
  },
  encabezado: {
    gap: tema.espacios.sm,
    marginBottom: tema.espacios.sm,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: tema.espacios.md,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    borderRadius: tema.radios.sm,
    backgroundColor: tema.colores.superficie,
    color: tema.colores.texto,
    fontSize: 16,
  },
  auxiliar: {
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
  titulo: {
    color: tema.colores.texto,
    fontWeight: '700',
  },
  autor: {
    color: tema.colores.textoSecundario,
  },
});
