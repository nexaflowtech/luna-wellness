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

function AuthGate() {
  const { user, isLoading, onboardingComplete } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // AuthGate only mounts after fonts are loaded (RootLayout returns null until then).
    // Now we also wait for auth state to resolve before dismissing the splash screen.
    if (!isLoading && onboardingComplete !== undefined) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, onboardingComplete]);

  // Deep Link & Navigation Guard
  useEffect(() => {
    if (isLoading || onboardingComplete === undefined) return;

    const rootSegment = segments[0];
    if (!rootSegment) return; // Allow root index.tsx to handle initial redirects

    if (!user) {
      // Unauthenticated: allow onboarding and auth
      if (rootSegment !== '(onboarding)' && rootSegment !== '(auth)') {
        router.replace('/(onboarding)/login');
      }
    } else if (!onboardingComplete) {
      // Authenticated but onboarding incomplete: allow onboarding and program checkout
      if (rootSegment !== '(onboarding)' && rootSegment !== '(program)') {
        router.replace('/(onboarding)/login');
      }
    } else {
      // Authenticated and onboarded: allow main app navigation
      if (rootSegment !== '(tabs)' && rootSegment !== '(secondary)' && rootSegment !== '(modals)') {
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, onboardingComplete, segments]);

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
    async function checkUpdate() {
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
              <AuthGate />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="splash" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="(program)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(secondary)" />

                <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
                <Stack.Screen name="login" />
                <Stack.Screen name="modal" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </NetworkGuard>
    </ErrorBoundary>
  );
}
