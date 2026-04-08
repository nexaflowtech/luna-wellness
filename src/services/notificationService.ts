import Constants from 'expo-constants';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/src/config/firebase';

const isExpoGo = Constants.appOwnership === 'expo';
let notificationsModule: typeof import('expo-notifications') | null = null;
let handlerConfigured = false;

async function getNotificationsModule() {
  if (isExpoGo) return null;
  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');
  }
  if (!handlerConfigured && notificationsModule) {
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerConfigured = true;
  }
  return notificationsModule;
}

export async function registerPushToken(uid: string): Promise<string | null> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas?.projectId,
    })
  ).data;

  await setDoc(
    doc(db, 'users', uid),
    {
      expoPushToken: token,
      notificationsEnabled: true,
    },
    { merge: true }
  );

  return token;
}

export async function scheduleDailyReminders() {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  const reminders = [
    { title: 'Workout Reminder', body: "Time for today's movement plan.", hour: 7, minute: 30 },
    { title: 'Meal Reminder', body: "Check your Luna meal plan for this slot.", hour: 13, minute: 0 },
    { title: 'Water Reminder', body: 'Hydration check-in: log your water intake.', hour: 16, minute: 0 },
    { title: 'Consultation Reminder', body: "Review today's consultation schedule.", hour: 10, minute: 0 },
    { title: 'AI Suggestion', body: 'Your AI coach has updated suggestions for today.', hour: 20, minute: 0 },
  ];

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const reminder of reminders) {
    await Notifications.scheduleNotificationAsync({
      content: { title: reminder.title, body: reminder.body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: reminder.minute,
      },
    });
  }
}
