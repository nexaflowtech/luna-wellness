// Step 3: This file intentionally removed in favour of app/(onboarding)/login.tsx
// AuthGate in _layout.tsx redirects to /(onboarding)/login
// This file exists only as a placeholder to satisfy the Stack.Screen name="login" registration.
// It immediately redirects so users never see it.

import { Redirect } from 'expo-router';

export default function LoginRedirect() {
  return <Redirect href="/(onboarding)/login" />;
}
