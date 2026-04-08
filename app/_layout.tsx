import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { UserProvider } from '@/src/context/UserContext';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { registerPushToken, scheduleDailyReminders } from '@/src/services/notificationService';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const {
    user,
  } = useAuth();

  useEffect(() => {
    if (!user) return;
    registerPushToken(user.uid).catch(() => undefined);
    scheduleDailyReminders().catch(() => undefined);
  }, [user]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <AuthGate />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(program)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(secondary)" />

            {/* Legacy groups kept for compatibility with existing UI files */}
            <Stack.Screen name="(app)" />
            <Stack.Screen name="(setup)" />
            <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
            <Stack.Screen name="login" />
            <Stack.Screen name="modal" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
