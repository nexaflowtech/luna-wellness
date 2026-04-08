import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', headerShown: false }}>
      <Stack.Screen name="habit-tracker" />
      <Stack.Screen name="ai-coach" />
      <Stack.Screen name="consultation" />
      <Stack.Screen name="health-checkup" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
