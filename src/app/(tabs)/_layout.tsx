import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { tema } from '../../constants/tema';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tema.colores.primario,
        tabBarInactiveTintColor: tema.colores.textoSecundario,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color ? String(color) : tema.colores.primario} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color ? String(color) : tema.colores.primario} />
          ),
        }}
      />
    </Tabs>
  );
}
