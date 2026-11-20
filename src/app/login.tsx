import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, Stack } from 'expo-router';

import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';

export default function LoginRoute() {
  const { iniciarSesion } = useBiblioteca();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const ingresar = () => {
    if (iniciarSesion(usuario.trim(), clave)) {
      router.replace('/mostrador');
      return;
    }
    setError('El usuario o la clave no son correctos.');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Ingreso de personal' }} />
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Ingreso del personal</Text>
        <TextInput
          accessibilityLabel="Usuario"
          autoCapitalize="none"
          placeholder="Usuario"
          placeholderTextColor={tema.colores.textoSecundario}
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
        />
        <TextInput
          accessibilityLabel="Clave"
          autoCapitalize="none"
          placeholder="Clave"
          placeholderTextColor={tema.colores.textoSecundario}
          secureTextEntry
          style={styles.input}
          value={clave}
          onChangeText={setClave}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable accessibilityRole="button" style={styles.boton} onPress={ingresar}>
          <Text style={styles.textoBoton}>Ingresar</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    gap: tema.espacios.md,
    padding: tema.espacios.lg,
    backgroundColor: tema.colores.fondo,
  },
  titulo: {
    color: tema.colores.texto,
    fontSize: 24,
    fontWeight: '800',
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
  error: {
    color: tema.colores.error,
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
