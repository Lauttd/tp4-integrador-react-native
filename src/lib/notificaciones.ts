import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';

const CANAL_PRESTAMOS = 'prestamos';

export async function prepararCanalNotificaciones(): Promise<void> {
  if (Platform.OS === 'android' && !isRunningInExpoGo()) {
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
  const trigger: Notifications.TimeIntervalTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 15,
    ...(isRunningInExpoGo() ? {} : { channelId: CANAL_PRESTAMOS }),
  };

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de devolución',
      body: `Mañana vence el préstamo de “${titulo}”.`,
    },
    trigger,
  });
}

export function cancelarRecordatorio(identificador: string): Promise<void> {
  return Notifications.cancelScheduledNotificationAsync(identificador);
}
