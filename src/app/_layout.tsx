import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { BibliotecaProvider } from '../context/BibliotecaContext';

export default function RootLayout() {
  return (
    <BibliotecaProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="libro/[isbn]" options={{ title: 'Detalle del libro' }} />
        <Stack.Screen name="buscar" options={{ title: 'Buscar libros' }} />
        <Stack.Screen name="escanear" options={{ title: 'Escanear libro' }} />
        <Stack.Screen name="reservar/[isbn]" options={{ presentation: 'modal', title: 'Reservar' }} />
        <Stack.Screen name="personal" options={{ title: 'Personal' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Página no encontrada' }} />
      </Stack>
    </BibliotecaProvider>
  );
}
