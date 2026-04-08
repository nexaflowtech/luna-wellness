import { Stack } from 'expo-router';

export default function ProgressStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
