// Secondary Stack Layout
// All secondary screens slide in as standard push navigations.
// No UI layout code is modified here – this is only navigation wiring.

import { Stack } from 'expo-router';

export default function SecondaryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {/* hormone_report_insights -> HormoneReportInsightsScreen */}
      <Stack.Screen name="hormone-insights" />

      {/* doctor_consultations -> DoctorConsultationsScreen */}
      <Stack.Screen name="consultations" />

      {/* doctor_profile_booking -> DoctorProfileBookingScreen */}
      <Stack.Screen name="doctor-booking" />

      {/* lab_test_packages -> LabTestPackagesScreen */}
      <Stack.Screen name="lab-tests" />

      {/* meal_detail -> MealDetailScreen */}
      <Stack.Screen name="meal-detail" />

      {/* luna_ai_coach -> AICoachScreen */}
      <Stack.Screen name="ai-coach" />

      {/* workout_detail -> WorkoutDetailScreen */}
      <Stack.Screen name="workout-detail" />

      {/* cycle_tracking -> CycleTrackingScreen */}
      <Stack.Screen name="cycle-tracking" />

      {/* progress_tracker -> ProgressTrackerScreen */}
      <Stack.Screen name="progress" />

      {/* subscription_plans -> SubscriptionPlansScreen */}
      <Stack.Screen name="subscriptions" />

    </Stack>
  );
}
