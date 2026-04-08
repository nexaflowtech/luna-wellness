import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Step 0 — Splash/Intro */}
      <Stack.Screen name="index" />
      {/* Step 1 — Editorial intro */}
      <Stack.Screen name="step1" />
      {/* Step 2 — Login */}
      <Stack.Screen name="login" />
      {/* Registration */}
      <Stack.Screen name="register" />
      {/* Step 3 — OTP verification */}
      <Stack.Screen name="otp" />
      {/* Step 4 — Profile / Goal selection */}
      <Stack.Screen name="profile-setup" />
      {/* Step 5 — Basic details based on selected goals */}
      <Stack.Screen name="profile-details" />
      {/* Step 5.5 — Real Luna AI plan generation */}
      <Stack.Screen name="ai-plan-generating" />
      <Stack.Screen name="ai-plan-result" />
      {/* Step 5 — Detailed health questionnaire */}
      <Stack.Screen name="questionnaire" />
      {/* Step 6 — AI risk score generation */}
      <Stack.Screen name="risk-score" />
      {/* Step 7 — Program recommendation (writes onboardingComplete) */}
      <Stack.Screen name="program-recommendation" />
      {/* Legacy screens (kept for compatibility) */}
      <Stack.Screen name="health-assessment" />
    </Stack>
  );
}
