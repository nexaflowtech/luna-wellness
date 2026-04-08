import { Stack } from 'expo-router';

export default function SetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="health-assessment" />
      <Stack.Screen name="program-recommendation" />
      <Stack.Screen name="subscription" />
    </Stack>
  );
}
