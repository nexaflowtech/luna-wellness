import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, onboardingComplete, isLoading } = useAuth();

  if (isLoading) return (
    <View style={{ flex: 1, backgroundColor: '#080B14', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#6EE7B7" />
    </View>
  );

  if (user && onboardingComplete) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(onboarding)/login" />;
}
