import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';

import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';
import { esIsbnValido } from '../lib/catalogo';

export default function EscanearRoute() {
  const [permiso] = useCameraPermissions();
  const [isbnManual, setIsbnManual] = useState('');
  const [escaneoActivo, setEscaneoActivo] = useState(true);
  const procesando = useRef(false);
  const { libros } = useBiblioteca();

  useEffect(() => {
    if (permiso && !permiso.granted) {
      router.replace('/permisos/camara');
    }
  }, [permiso]);

  const abrirLibro = (isbn: string) => {
    if (!esIsbnValido(isbn)) {
      Alert.alert('ISBN inválido', 'Ingresá un ISBN de 13 dígitos.');
      return;
    }
    if (!libros.some((libro) => libro.isbn === isbn)) {
      Alert.alert('Libro no encontrado', 'Ese ISBN no está en el catálogo. Podés seguir escaneando.');
      setEscaneoActivo(true);
      procesando.current = false;
      return;
    }
    router.replace(`/libro/${isbn}`);
  };

  const manejarEscaneo = ({ data, type }: BarcodeScanningResult) => {
    if (!escaneoActivo || procesando.current || type !== 'ean13') {
      return;
    }
    procesando.current = true;
    setEscaneoActivo(false);
    abrirLibro(data);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.instruccion}>Apuntá al código EAN-13 de la contratapa.</Text>
      {permiso?.granted && (
        <CameraView
          style={styles.camara}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
          onBarcodeScanned={escaneoActivo ? manejarEscaneo : undefined}
        />
      )}
      <TextInput
        accessibilityLabel="Ingresar ISBN manualmente"
        keyboardType="number-pad"
        placeholder="ISBN de 13 dígitos"
        placeholderTextColor={tema.colores.textoSecundario}
        style={styles.input}
        value={isbnManual}
        onChangeText={setIsbnManual}
      />
      <Pressable
        accessibilityRole="button"
        style={styles.boton}
        onPress={() => abrirLibro(isbnManual)}>
        <Text style={styles.textoBoton}>Abrir ISBN</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    gap: tema.espacios.md,
    padding: tema.espacios.md,
    backgroundColor: tema.colores.fondo,
  },
  instruccion: {
    color: tema.colores.texto,
    fontSize: 16,
  },
  camara: {
    minHeight: 280,
    borderRadius: tema.radios.md,
    overflow: 'hidden',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: tema.espacios.md,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    borderRadius: tema.radios.sm,
    backgroundColor: tema.colores.superficie,
    color: tema.colores.texto,
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
});
