import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

export default function Index() {
  const { user, onboardingComplete, isLoading } = useAuth();

  if (isLoading) return null;

  if (user && onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/splash" />;
}
