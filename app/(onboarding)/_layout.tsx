import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="profile-details" />
      <Stack.Screen name="goal-physique" />
      <Stack.Screen name="lifestyle" />
      <Stack.Screen name="ai-loading" />
      <Stack.Screen name="ai-plan-generating" />
      <Stack.Screen name="ai-plan-result" />
      <Stack.Screen name="pricing" />
      <Stack.Screen name="payment-success" />
      <Stack.Screen name="plan-ready" />
    </Stack>
  );
}
