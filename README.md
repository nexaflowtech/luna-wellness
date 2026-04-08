# Luna Wellness

## Project Overview
Luna Wellness is an Expo React Native application designed for personalized health and wellness. It integrates comprehensive modules like cycle tracking, diet and fitness dashboards, doctor consultations, community feeds, and an AI Coach. The project maintains a high-fidelity UI derived from a "Living Sanctuary" Stitch export, powered by Firebase (Authentication & Firestore) and Context API for state management.

## Folder Structure & Stitch UI Rules
**IMPORTANT RULES:**
- Do not modify or restructure existing UI screen folders.
- Preserve all Stitch layout fidelity.
- Avoid renaming files unless required for navigation wiring.
- Document only safe integration steps.

The UI components are structured purely from the provided Stitch export folders:
- `coach_assignment_panel/`
- `community_feed/`
- `cycle_tracking/`
- `diet_dashboard/`
- `dietitian_messaging/`
- `doctor_consultations/`
- `doctor_profile_booking/`
- `fitness_dashboard/`
- `health_goals_editor/`
- `home_dashboard/`
- `hormone_report_insights/`
- `lab_test_packages/`
- `login_screen/`
- `luna_ai_coach/`
- `luna_radiance/`
- `meal_detail/`
- `onboarding_1/`
- `premium_goal_selection/`
- `progress_tracker/`
- `splash_screen/`
- `subscription_plans/`
- `user_profile/`
- `workout_detail/`

## Screen Mapping Table
| Stitch UI Folder | Screen Component Name |
| :--- | :--- |
| `coach_assignment_panel` | `CoachAssignmentScreen` |
| `community_feed` | `CommunityScreen` |
| `cycle_tracking` | `CycleTrackingScreen` |
| `diet_dashboard` | `DietDashboardScreen` |
| `dietitian_messaging` | `DietitianMessagingScreen` |
| `doctor_consultations` | `DoctorConsultationsScreen` |
| `doctor_profile_booking` | `DoctorProfileBookingScreen` |
| `fitness_dashboard` | `FitnessDashboardScreen` |
| `health_goals_editor` | `HealthGoalsEditorScreen` |
| `home_dashboard` | `HomeDashboardScreen` |
| `hormone_report_insights` | `HormoneReportInsightsScreen` |
| `lab_test_packages` | `LabTestPackagesScreen` |
| `login_screen` | `LoginScreen` |
| `luna_ai_coach` | `AICoachScreen` |
| `luna_radiance` | `RadianceScreen` |
| `meal_detail` | `MealDetailScreen` |
| `onboarding_1` | `OnboardingScreen` |
| `premium_goal_selection` | `GoalSelectionScreen` |
| `progress_tracker` | `ProgressTrackerScreen` |
| `splash_screen` | `SplashScreen` |
| `subscription_plans` | `SubscriptionPlansScreen` |
| `user_profile` | `UserProfileScreen` |
| `workout_detail` | `WorkoutDetailScreen` |

## Navigation Architecture

**Root Stack:**
- `SplashScreen`
- `LoginScreen`
- `OnboardingScreen`
- `GoalSelectionScreen`
- `MainTabs`

**MainTabs Stack:**
- `HomeDashboardScreen`
- `FitnessDashboardScreen`
- `DietDashboardScreen`
- `CommunityScreen`
- `UserProfileScreen`

**Secondary Stack Screens:**
- `HormoneReportInsightsScreen`
- `DoctorConsultationsScreen`
- `DoctorProfileBookingScreen`
- `LabTestPackagesScreen`
- `MealDetailScreen`
- `WorkoutDetailScreen`
- `ProgressTrackerScreen`
- `CycleTrackingScreen`
- `AICoachScreen`
- `SubscriptionPlansScreen`

## Authentication Flow
1. **App launch** → `SplashScreen`
2. **Check auth state:**
   - If logged in → `MainTabs`
   - If not logged in → `LoginScreen`

## Onboarding Flow
1. `OnboardingScreen`
2. `GoalSelectionScreen`
3. Save selections to Firestore.
4. Redirect to `HomeDashboardScreen`.

## Firebase Database Schema (Firestore)
The following collections underpin the data architecture:
- `users`: Core profile data.
- `healthProfiles`: In-depth health metrics and history.
- `goalSelections`: Onboarding goals and tracked objectives.
- `cycleTracking`: Menstrual cycle logs and predictions.
- `dietPlans`: Daily dietary schedules.
- `workouts`: Custom fitness regimens.
- `doctorAppointments`: Scheduled consultations.
- `labReports`: Medical lab results.
- `hormoneReports`: Hormonal analysis logs.
- `progressTracking`: User milestones and check-ins.
- `subscriptions`: Monetization and tier access.
- `communityPosts`: User-generated social content.
- `chatMessages`: Dietitian and coach communication.

### Data Ownership Rules
- Users can **only** read/write their own health data.
- Admin roles manage doctors and workout programs.

## Future Modules Integration Notes & Safe Development Rules
- **UI Fidelity:** Keep the original HTML/CSS structure from Stitch intact. Translating Tailwind classes directly to `NativeWind` is the safest path to avoid UI conflicts. Avoid applying ad-hoc styles that override the defined tokens.
- **State Management:** Use Context API cleanly for global states (Auth, Theme). 
- **AI Coach:** Hook into the OpenAI API via isolated backend functions or secure client-side handlers exclusively for the `AICoachScreen` component.
