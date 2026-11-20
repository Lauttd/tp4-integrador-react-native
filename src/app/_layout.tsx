import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { BibliotecaProvider, useBiblioteca } from '../context/BibliotecaContext';

export default function RootLayout() {
  return (
    <BibliotecaProvider>
      <RootStack />
    </BibliotecaProvider>
  );
}

function RootStack() {
  const { sesionPersonal } = useBiblioteca();

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="libro/[isbn]" options={{ title: 'Detalle del libro' }} />
        <Stack.Screen name="buscar" options={{ title: 'Buscar libros' }} />
        <Stack.Screen name="escanear" options={{ title: 'Escanear libro' }} />
        <Stack.Screen name="reservar/[isbn]" options={{ presentation: 'modal', title: 'Reservar' }} />
        <Stack.Screen name="permisos/[recurso]" options={{ presentation: 'modal', title: 'Permiso necesario' }} />
        <Stack.Screen name="reserva" options={{ headerShown: false }} />
        <Stack.Screen name="personal" options={{ title: 'Personal' }} />
        <Stack.Protected guard={!sesionPersonal} redirectTo="/login">
          <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Ingreso de personal' }} />
        </Stack.Protected>
        <Stack.Protected guard={sesionPersonal} redirectTo="/">
          <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
        </Stack.Protected>
        <Stack.Screen name="+not-found" options={{ title: 'Página no encontrada' }} />
      </Stack>
    </>
  );
}
