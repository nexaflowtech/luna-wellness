import { Stack } from 'expo-router';

export default function ProgramLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="recommendation" />
      <Stack.Screen name="purchase" />
    </Stack>
  );
}
