import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';

const CANAL_PRESTAMOS = 'prestamos';

export async function prepararCanalNotificaciones(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL_PRESTAMOS, {
      name: 'Recordatorios de préstamos',
      importance: AndroidImportance.DEFAULT,
    });
  }
}

export async function pedirPermisoNotificaciones(): Promise<boolean> {
  await prepararCanalNotificaciones();
  const actual = await Notifications.getPermissionsAsync();
  if (actual.granted) {
    return true;
  }
  const solicitado = await Notifications.requestPermissionsAsync();
  return solicitado.granted;
}

export function programarRecordatorio(titulo: string): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de devolución',
      body: `Mañana vence el préstamo de “${titulo}”.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 15,
      channelId: CANAL_PRESTAMOS,
    },
  });
}

export function cancelarRecordatorio(identificador: string): Promise<void> {
  return Notifications.cancelScheduledNotificationAsync(identificador);
}
