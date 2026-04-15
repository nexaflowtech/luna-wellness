import { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { UserProvider } from '@/src/context/UserContext';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { ErrorBoundary } from '@/src/components/system/ErrorBoundary';
import { NetworkGuard } from '@/src/components/system/NetworkGuard';
import { registerPushToken, scheduleDailyReminders } from '@/src/services/notificationService';

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { user, isLoading, onboardingComplete } = useAuth();

  // Hide splash screen only when auth is fully determined
  useEffect(() => {
    if (!isLoading && onboardingComplete !== undefined) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, onboardingComplete]);

  useEffect(() => {
    if (!user) return;
    registerPushToken(user.uid).catch(() => undefined);
    scheduleDailyReminders().catch(() => undefined);
  }, [user]);

  // CRITICAL: Always render the Stack navigator so router.push() always has
  // a mounted navigator. Never return null — that unmounts the Stack and
  // causes all router.push() calls to silently fail.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="splash" />

      {/* Group registrations */}
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(secondary)" />
      <Stack.Screen name="(program)" />
      <Stack.Screen
        name="(modals)"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function checkUpdate() {
      // Updates are only available in production builds, not Expo Go / dev
      if (__DEV__) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log(e);
      }
    }
    checkUpdate();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return (
    <ErrorBoundary>
      <NetworkGuard>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <RootNavigation />
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </NetworkGuard>
    </ErrorBoundary>
  );
}
