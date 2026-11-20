import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';
import { EstadoCatalogo } from './EstadoCatalogo';
import { TarjetaLibro } from './TarjetaLibro';

export function CatalogoScreen() {
  const {
    libros,
    cargando,
    error,
    reintentar,
    recientes,
    registrarReciente,
  } = useBiblioteca();

  return (
    <FlatList
      contentContainerStyle={styles.lista}
      data={libros}
      keyExtractor={(libro) => libro.isbn}
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <View style={styles.tituloFila}>
            <View>
              <Text style={styles.titulo}>Biblioteca IPF</Text>
              <Text style={styles.subtitulo}>Encontrá tu próxima lectura</Text>
            </View>
            <Link href="/personal" asChild>
              <Pressable accessibilityRole="button" accessibilityLabel="Abrir acceso de personal" style={styles.icono}>
                <Ionicons name="person-outline" size={24} color={tema.colores.primario} />
              </Pressable>
            </Link>
          </View>
          <View style={styles.acciones}>
            <Link href="/buscar" asChild>
              <Pressable accessibilityRole="button" style={styles.accion}>
                <Ionicons name="search-outline" size={20} color={tema.colores.primario} />
                <Text style={styles.textoAccion}>Buscar</Text>
              </Pressable>
            </Link>
            <Link href="/escanear" asChild>
              <Pressable accessibilityRole="button" style={styles.accion}>
                <Ionicons name="barcode-outline" size={20} color={tema.colores.primario} />
                <Text style={styles.textoAccion}>Escanear</Text>
              </Pressable>
            </Link>
          </View>
          {recientes.length > 0 && (
            <View>
              <Text style={styles.seccion}>Vistos recientemente</Text>
              {recientes.map((libro) => (
                <Text key={libro.isbn} style={styles.reciente}>
                  {libro.titulo}
                </Text>
              ))}
            </View>
          )}
          <EstadoCatalogo
            cargando={cargando}
            error={error}
            vacio={!cargando && !error && libros.length === 0}
            onReintentar={reintentar}
          />
        </View>
      }
      renderItem={({ item }) => (
        <TarjetaLibro
          libro={item}
          disponibles={item.ejemplares}
          onAbrir={registrarReciente}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flexGrow: 1,
    padding: tema.espacios.md,
    backgroundColor: tema.colores.fondo,
  },
  encabezado: {
    gap: tema.espacios.md,
    marginBottom: tema.espacios.md,
  },
  tituloFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  icono: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acciones: {
    flexDirection: 'row',
    gap: tema.espacios.sm,
  },
  accion: {
    minHeight: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tema.espacios.sm,
    borderRadius: tema.radios.sm,
    backgroundColor: tema.colores.primarioClaro,
  },
  textoAccion: {
    color: tema.colores.primario,
    fontWeight: '700',
  },
  seccion: {
    color: tema.colores.texto,
    fontSize: 18,
    fontWeight: '700',
  },
  reciente: {
    color: tema.colores.textoSecundario,
    marginTop: tema.espacios.xs,
  },
});
