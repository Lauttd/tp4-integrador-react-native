jest.mock('expo', () => ({
  isRunningInExpoGo: () => true,
}));

jest.mock('expo-notifications', () => ({
  AndroidImportance: { DEFAULT: 5 },
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
  getPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notificacion-1'),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

import * as Notifications from 'expo-notifications';
import { pedirPermisoNotificaciones, programarRecordatorio } from '../src/lib/notificaciones';

describe('notificaciones en Expo Go', () => {
  it('no intenta crear un canal nativo que Expo Go no expone', async () => {
    await expect(pedirPermisoNotificaciones()).resolves.toBe(true);
    expect(Notifications.setNotificationChannelAsync).not.toHaveBeenCalled();
  });

  it('programa el aviso sin referenciar un canal inexistente en Expo Go', async () => {
    await programarRecordatorio('Ficciones');
    const scheduleNotificationMock = Notifications.scheduleNotificationAsync as jest.Mock;

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ type: 'timeInterval', seconds: 15 }),
      }),
    );
    expect(scheduleNotificationMock.mock.calls[0][0].trigger.channelId).toBeUndefined();
  });
});
