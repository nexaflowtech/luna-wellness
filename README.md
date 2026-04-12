# 🌙 Luna Wellness — Mobile App

> **A personalized AI-powered hormonal health companion built with React Native + Expo Router**

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Detected Routing Tree](#-detected-routing-tree)
4. [Screen Hierarchy Diagram](#️-screen-hierarchy-diagram)
5. [Current Navigation Flow](#-current-navigation-flow)
6. [Issues Found in Routing](#-issues-found-in-routing)
7. [Missing Recommended Screens](#-missing-recommended-screens)
8. [Suggested Improved Routing Architecture](#-suggested-improved-routing-architecture)
9. [Suggested Folder Structure](#-suggested-folder-structure)
10. [MVP Completion Roadmap (48-Hour Plan)](#️-mvp-completion-roadmap-48-hour-plan)

---

## 🌸 Project Overview

**Luna Wellness** is a production-grade React Native mobile app built for women's health — specifically targeting PCOD/PCOS management, cycle tracking, hormonal balance, and AI-powered personalization.

| Property | Value |
|---|---|
| **App Name** | Luna Wellness |
| **Bundle ID (iOS)** | `com.suaib.lunawellness` |
| **Package (Android)** | `com.suaib.lunawellness` |
| **Expo SDK** | `~54.0.0` |
| **Expo Router** | `~6.0.23` |
| **React Native** | `0.81.5` |
| **React** | `19.1.0` |
| **EAS Project ID** | `c5afa357-0aba-48e3-a395-8ed5ec47af0d` |
| **Owner** | `suaib` |
| **Orientation** | Portrait only |
| **Deep Link Scheme** | `lunawellness://` |

### Core Capabilities
- 🤖 **AI-driven onboarding** — Adaptive branching based on health goals (PCOS, Thyroid, Cycle, Fertility)
- 📊 **Hormonal risk scoring** — Animated gauge generated from questionnaire data
- 🍽️ **Diet & Workout plans** — Personalized meal and fitness dashboards
- 🔁 **Cycle tracking** — Menstrual cycle monitoring widget
- 💬 **Community** — Social feed for peer wellness support
- 🩺 **AI Coach + Doctor Booking** — In-app consultation and telemedicine
- 🔔 **Push notifications** — Daily reminders via Expo Notifications + Firebase
- 🔐 **Firebase Auth** — Email/OTP + Google Sign-in (in progress)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native + Expo SDK 54 |
| **Navigation** | Expo Router v6 (file-based) |
| **Styling** | NativeWind v4 + Tailwind CSS v3 |
| **Authentication** | Firebase Auth + Firestore |
| **AI Engine** | Google Gemini (`@google/generative-ai`) |
| **State Management** | Zustand v5 + React Context |
| **Forms** | React Hook Form + Zod |
| **Animations** | React Native Reanimated v4 + Worklets |
| **Chat UI** | React Native Gifted Chat |
| **Notifications** | Expo Notifications |
| **Storage** | AsyncStorage + Expo SecureStore |
| **Build** | EAS Build (Android SDK 35, iOS 15.1+) |

---

## 🗺️ Detected Routing Tree

Full file-based routing tree discovered from the `/app` directory:

```
app/
├── _layout.tsx                          ← Root Stack (ThemeProvider > AuthProvider > UserProvider)
├── index.tsx                            ← Entry point → Redirect to /(onboarding)
├── login.tsx                            ← Legacy: standalone login (unused)
├── modal.tsx                            ← Legacy: generic modal (unused)
├── +not-found.tsx                       ← 404 catch-all
├── +html.tsx                            ← Web HTML wrapper
│
├── (onboarding)/                        ← Stack Navigator (no header)
│   ├── _layout.tsx
│   ├── index.tsx                        ← Splash / Brand screen
│   ├── step1.tsx                        ← Editorial intro
│   ├── login.tsx                        ← OTP-based login
│   ├── register.tsx                     ← Registration
│   ├── otp.tsx                          ← OTP verification
│   ├── profile-setup.tsx                ← Gender + Goal selection
│   ├── adaptive-questions.tsx           ← Conditional: PCOS/Thyroid/Cycle deep questions
│   ├── profile-details.tsx              ← Personal details (age, weight, height etc.)
│   ├── questionnaire.tsx                ← Extended health questionnaire
│   ├── risk-score.tsx                   ← AI Hormonal Risk Score display
│   ├── program-recommendation.tsx       ← Redirect → /(program)/recommendation
│   ├── health-assessment.tsx            ← Legacy stub (kept for compat)
│   └── [ai-plan-generating.tsx]         ← Registered in layout, FILE MISSING
│   └── [ai-plan-result.tsx]             ← Registered in layout, FILE MISSING
│
├── (auth)/                              ← Stack Navigator (slide_from_right)
│   ├── _layout.tsx
│   ├── index.tsx                        ← Sign-in form (email + password)
│   ├── register.tsx                     ← Registration form
│   ├── forgot-password.tsx              ← Password reset
│   └── [otp-verify.tsx]                 ← File exists but NOT in layout
│
├── (program)/                           ← Stack Navigator
│   ├── _layout.tsx
│   ├── index.tsx                        ← Redirect → /(program)/recommendation
│   ├── recommendation.tsx               ← AI program recommendation card
│   └── purchase.tsx                     ← Subscription / paywall
│
├── (tabs)/                              ← Tab Navigator (Main App)
│   ├── _layout.tsx                      ← 5 tabs: Home, Fitness, Diet, Community, Profile
│   ├── index.tsx                        ← Home Dashboard (rich widget layout)
│   ├── fitness.tsx                      ← Fitness tab
│   ├── diet.tsx                         ← Diet tab
│   ├── community.tsx                    ← Community tab
│   ├── profile.tsx                      ← Profile tab
│   └── two.tsx                          ← Orphan screen (no tab registered)
│
├── (secondary)/                         ← Stack Navigator (slide_from_right)
│   ├── _layout.tsx
│   ├── hormone-insights.tsx             ← Full hormone report
│   ├── ai-coach.tsx                     ← Re-export from (modals)/ai-coach
│   ├── consultations.tsx                ← Re-export from (modals)/consultation
│   ├── doctor-booking.tsx               ← Stub (2 lines)
│   ├── lab-tests.tsx                    ← Lab test packages
│   ├── meal-detail.tsx                  ← Meal detail view
│   ├── workout-detail.tsx               ← Stub (2 lines)
│   ├── cycle-tracking.tsx               ← Cycle tracker screen
│   ├── progress.tsx                     ← Stub (2 lines)
│   └── subscriptions.tsx                ← Redirect → /(program)/purchase
│
├── (modals)/                            ← Stack Navigator (modal presentation)
│   ├── _layout.tsx
│   ├── habit-tracker.tsx                ← Habit tracking modal
│   ├── ai-coach.tsx                     ← AI Coach chat modal
│   ├── consultation.tsx                 ← Doctor consultation modal
│   ├── health-checkup.tsx               ← Health checkup modal
│   └── notifications.tsx                ← Notification center
│
├── (app)/                               ← Legacy Tab Navigator (duplicate of (tabs))
│   ├── _layout.tsx                      ← Tabs: Home, Workout, Diet, Progress, Community
│   ├── (home)/index.tsx
│   ├── (workout)/index.tsx, player.tsx
│   ├── (diet)/index.tsx
│   ├── (progress)/index.tsx
│   └── (community)/index.tsx
│
└── (setup)/                             ← Legacy Stack Navigator
    ├── _layout.tsx
    ├── profile.tsx
    ├── health-assessment.tsx
    ├── program-recommendation.tsx
    └── subscription.tsx
```

---

## 🗃️ Screen Hierarchy Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    app/_layout.tsx                      │
│         (Root Stack — ThemeProvider/AuthProvider)       │
└───────────────────────┬─────────────────────────────────┘
                        │
          ┌─────────────▼────────────┐
          │      app/index.tsx       │
          │  → Redirect to           │
          │    /(onboarding)         │
          └─────────────┬────────────┘
                        │
     ┌──────────────────▼──────────────────────┐
     │           (onboarding)/                 │
     │      [Splash → Step1 → Login]           │
     │                                         │
     │  index → step1 → login ──┬─► register  │
     │                          │   → otp      │
     │                          │              │
     │             profile-setup─┤             │
     │               (gender + goals)          │
     │                  │                      │
     │      ┌───────────┴──────────────┐       │
     │      │ goals contain PCOS/      │       │
     │      │ thyroid/cycle/fertility  │       │
     │      ▼                          ▼       │
     │ adaptive-questions     profile-details   │
     │      └───────────┬──────────────┘       │
     │                  │                      │
     │            questionnaire                │
     │                  │                      │
     │            risk-score                   │
     │                  │                      │
     │       program-recommendation            │
     │       (redirect to (program)/)          │
     └──────────────────┬──────────────────────┘
                        │
     ┌──────────────────▼──────────────────────┐
     │              (program)/                  │
     │  recommendation → purchase               │
     └──────────────────┬──────────────────────┘
                        │
     ┌──────────────────▼──────────────────────┐
     │               (tabs)/                   │
     │   ┌──────┬────────┬──────┬──────────┐   │
     │  Home  Fitness  Diet  Community  Profile │
     │   │      │        │       │                │
     │   │      └────────┴───────┘                │
     │   │                                        │
     │   └────── Quick Actions ───────────────┐  │
     │           ├── /(secondary)/ai-coach    │  │
     │           ├── /(secondary)/doctor-booking │
     │           ├── /(secondary)/hormone-insights│
     │           ├── /(modals)/habit-tracker   │  │
     │           └── /(secondary)/progress    │  │
     └────────────────────────────────────────┘
```

---

## 🔄 Current Navigation Flow

### Happy Path (New User)
```
App Launch
  └─► app/index.tsx → Redirect /(onboarding)
        └─► (onboarding)/index    [Splash Screen — "Start Journey" or "I have an account"]
              ├─► step1            [Editorial intro — Next / Skip → login]
              └─► login            [OTP-based login — Phone/Email input]
                    ├─► register   [Create account]
                    │     └─► otp  [OTP verification]
                    │
                    └─► profile-setup  [Gender + Goal selection]
                          │
                          ├── (if PCOS/thyroid/cycle goals selected)
                          │     └─► adaptive-questions  [Clinical deep-dive]
                          │           └─► profile-details [Age, height, weight etc.]
                          │
                          └── (if no adaptive goals)
                                └─► profile-details  [Age, height, weight etc.]
                                      └─► questionnaire  [Extended health goals + lifestyle]
                                            └─► risk-score  [Animated hormonal balance gauge]
                                                  └─► (program)/recommendation  [AI plan card]
                                                        └─► (program)/purchase  [Subscription/paywall]
                                                              └─► (tabs)/       [Main App — 5 tabs]
```

### Happy Path (Returning User)
```
App Launch → AuthContext checks Firebase user + onboardingComplete flag
  └─► If authenticated + onboardingComplete = true → (tabs)/
  └─► If authenticated + onboardingComplete = false → resume onboarding
  └─► If not authenticated → (onboarding)/index (no guard implemented)
```

> ⚠️ **Note:** The root `index.tsx` always redirects to `/(onboarding)` — there is NO auth guard at the root level. Returning users must sit through the splash screen every app launch.

---

## 🐛 Issues Found in Routing

### Critical Issues

| # | Severity | Issue | Location |
|---|---|---|---|
| 1 | 🔴 **CRITICAL** | `ai-plan-generating.tsx` and `ai-plan-result.tsx` are registered in `(onboarding)/_layout.tsx` but the **files do not exist**. Any navigation to these screens will crash. | `(onboarding)/_layout.tsx:22-23` |
| 2 | 🔴 **CRITICAL** | `app/index.tsx` unconditionally redirects ALL users to `/(onboarding)` — returning logged-in users with `onboardingComplete = true` are never routed to the main app. No auth guard at the root level. | `app/index.tsx` |
| 3 | 🔴 **CRITICAL** | `(auth)/index.tsx` Sign In button calls `router.replace('/(setup)/profile')` — routing to the **legacy setup group**, bypassing the modern `(tabs)/` main app entirely. | `(auth)/index.tsx:41` |

### High Priority Issues

| # | Severity | Issue | Location |
|---|---|---|---|
| 4 | 🟠 **HIGH** | **Duplicate Tab Navigator** — `(app)/` and `(tabs)/` both implement full tab navigation with identical feature areas (Home, Workout/Fitness, Diet, Community). Two competing Main App structures exist simultaneously. | `(app)/_layout.tsx`, `(tabs)/_layout.tsx` |
| 5 | 🟠 **HIGH** | `(auth)/otp-verify.tsx` exists as a file but is **not registered** in `(auth)/_layout.tsx`. It is an orphaned, inaccessible screen. | `(auth)/otp-verify.tsx` |
| 6 | 🟠 **HIGH** | `(tabs)/two.tsx` is an orphaned Expo template file with no tab registration, no content, and no purpose. | `(tabs)/two.tsx` |
| 7 | 🟠 **HIGH** | The `questionnaire.tsx` step in onboarding **re-collects goals** that were already gathered in `profile-setup.tsx` — duplicate data collection creates a confusing user experience and wastes a full screen. | `(onboarding)/questionnaire.tsx:86-98` |

### Medium Priority Issues

| # | Severity | Issue | Location |
|---|---|---|---|
| 8 | 🟡 **MEDIUM** | **Legacy groups `(app)/` and `(setup)/`** are kept "for compatibility" but add dead weight — 10+ screens that are either redirects or duplicates. These should be deleted or properly migrated. | `(app)/`, `(setup)/` |
| 9 | 🟡 **MEDIUM** | Five `(secondary)/` screens are **stubs** with only 2 lines of code: `doctor-booking.tsx`, `workout-detail.tsx`, `progress.tsx`, `consultations.tsx`, `ai-coach.tsx` — the last two are re-exports from `(modals)/`. | `(secondary)/` |
| 10 | 🟡 **MEDIUM** | `(onboarding)/adaptive-questions.tsx` shows `ProgressIndicator currentStep={2} totalSteps={4}` while `profile-setup.tsx` shows `currentStep={2} totalSteps={5}`. **Inconsistent progress tracking** breaks user orientation. | `adaptive-questions.tsx:80`, `profile-setup.tsx:83` |
| 11 | 🟡 **MEDIUM** | `app/login.tsx` and `app/modal.tsx` are standalone legacy files in the root that serve no purpose in the current routing architecture. | `app/login.tsx`, `app/modal.tsx` |
| 12 | 🟡 **MEDIUM** | `(onboarding)/health-assessment.tsx` is registered as a "legacy screen kept for compatibility" but navigates nowhere — dead code that could confuse future developers. | `(onboarding)/health-assessment.tsx` |

### Low Priority Issues

| # | Severity | Issue | Location |
|---|---|---|---|
| 13 | 🟢 **LOW** | Mixed styling approaches — some onboarding screens use `StyleSheet.create()` (e.g. `profile-setup`, `adaptive-questions`), others use NativeWind className (e.g. `index`, `step1`, `questionnaire`). No consistent pattern. | Multiple screens |
| 14 | 🟢 **LOW** | `questionnaire.tsx` hardcodes a Google-served user avatar image URL, which is a third-party resource that could break or be rate-limited. | `questionnaire.tsx:153` |
| 15 | 🟢 **LOW** | `(tabs)/_layout.tsx` uses `expo-symbols` (iOS-native icons) — these icons do not render on Android, resulting in invisible tab bar icons on Android devices. | `(tabs)/_layout.tsx` |

---

## 🚨 Missing Recommended Screens

| Screen | Purpose | Current Status |
|---|---|---|
| **Root Auth Guard** | Redirect authenticated users away from onboarding | ❌ Missing |
| **`ai-plan-generating.tsx`** | Loading/generating state between profile-details and AI result | ❌ File missing, registered in layout |
| **`ai-plan-result.tsx`** | Display AI-generated health plan before program recommendation | ❌ File missing, registered in layout |
| **`(tabs)/settings.tsx`** | App settings, notification preferences, account management | ❌ Missing |
| **`(secondary)/doctor-booking.tsx`** | Full doctor booking flow (currently a 2-line stub) | ⚠️ Stub only |
| **`(secondary)/progress.tsx`** | Full progress chart screen (currently a 2-line stub) | ⚠️ Stub only |
| **`(secondary)/workout-detail.tsx`** | Workout detail/player (currently a 2-line stub) | ⚠️ Stub only |
| **Onboarding completion guard** | Write `onboardingComplete = true` to Firestore after program purchase | ⚠️ Logic incomplete |
| **`(auth)/otp-verify.tsx`** | OTP verification for the `(auth)` group (file exists, unregistered) | ⚠️ Orphaned |
| **Biometric / Face ID screen** | Post-login biometric enrollment for secure fast re-auth | ❌ Missing |
| **`(tabs)/notifications.tsx`** | Notification center accessible from tabs | ❌ Only in modals |
| **Error boundary screens** | Graceful fallbacks for API/AI failures | ❌ Missing |

---

## ✅ Suggested Improved Routing Architecture

The suggested architecture consolidates the two competing tab navigators, adds a proper auth guard at the root, and cleans up legacy groups.

### Improved Root `_layout.tsx` — Auth Guard Pattern

```tsx
// app/_layout.tsx — Improved
export default function RootLayout() {
  const { user, isLoading, onboardingComplete } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        // Unauthenticated: only onboarding visible
        <Stack.Screen name="(onboarding)" />
      ) : !onboardingComplete ? (
        // Authenticated but not onboarded
        <>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(program)" />
        </>
      ) : (
        // Fully onboarded: main app
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(secondary)" />
          <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
        </>
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
```

### Improved Navigation Hierarchy

```
app/
├── _layout.tsx               ← Auth Guard (conditional rendering based on auth state)
├── +not-found.tsx
│
├── (onboarding)/             ← PUBLIC: No auth required
│   ├── index.tsx             ← Splash/Brand
│   ├── step1.tsx             ← Editorial intro
│   ├── login.tsx             ← OTP/Email login
│   ├── register.tsx          ← Registration
│   ├── otp.tsx               ← OTP verification
│   ├── profile-setup.tsx     ← Gender + Goal selection
│   ├── adaptive-questions.tsx← Conditional clinical deep-dive
│   ├── profile-details.tsx   ← Personal details
│   ├── questionnaire.tsx     ← Health questionnaire
│   ├── ai-plan-generating.tsx← [CREATE] AI loading state
│   ├── ai-plan-result.tsx    ← [CREATE] AI plan preview
│   └── risk-score.tsx        ← Hormonal risk gauge
│
├── (program)/                ← Post-onboarding program selection
│   ├── recommendation.tsx    ← AI program card
│   └── purchase.tsx          ← Paywall / subscription
│
├── (tabs)/                   ← PROTECTED: Main App (5 tabs)
│   ├── _layout.tsx           ← Use lucide-react-native (cross-platform icons)
│   ├── index.tsx             ← Home Dashboard
│   ├── fitness.tsx           ← Fitness & Workouts
│   ├── diet.tsx              ← Diet & Nutrition
│   ├── community.tsx         ← Community Feed
│   └── profile.tsx           ← User Profile + Settings
│
├── (secondary)/              ← Full-screen push navigations
│   ├── hormone-insights.tsx  ← Full hormone report
│   ├── ai-coach.tsx          ← AI Coach chat
│   ├── consultations.tsx     ← Doctor consultations list
│   ├── doctor-booking.tsx    ← [EXPAND] Doctor booking flow
│   ├── lab-tests.tsx         ← Lab test packages
│   ├── meal-detail.tsx       ← Meal detail
│   ├── workout-detail.tsx    ← [EXPAND] Workout player
│   ├── cycle-tracking.tsx    ← Cycle tracker
│   ├── progress.tsx          ← [EXPAND] Progress charts
│   └── settings.tsx          ← [CREATE] App settings
│
└── (modals)/                 ← Sheet/modal presentations
    ├── habit-tracker.tsx     ← Habit tracking
    ├── health-checkup.tsx    ← Health check modal
    └── notifications.tsx     ← Notification center
```

### Onboarding Flow Improvement

**Current (8+ steps, duplicate goal collection):**
```
index → step1 → login → register → otp → profile-setup → adaptive-questions?
     → profile-details → questionnaire [DUPLICATE GOALS] → risk-score → program
```

**Recommended (6 clean steps, no duplication):**
```
index → step1 → login/register → otp
  → profile-setup (gender + goals)
    → [if clinical goals] adaptive-questions
    → profile-details (age/weight/height + lifestyle inline)
    → ai-plan-generating (loading/animation)
    → ai-plan-result (plan preview)
    → risk-score (hormonal gauge)
    → (program)/recommendation
    → (program)/purchase
    → (tabs)/ ← onboardingComplete written to Firestore here
```

**Remove `questionnaire.tsx` as a separate step** — merge its goal-confirmation and free-text fields into `profile-details.tsx`.

---

## 📁 Suggested Folder Structure

```
luna-wellness/
├── app/                          ← Expo Router pages only (no business logic)
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   ├── (onboarding)/
│   ├── (program)/
│   ├── (tabs)/
│   ├── (secondary)/
│   └── (modals)/
│
├── src/
│   ├── components/
│   │   ├── atoms/               ← Button, Input, Avatar, Badge, Icon
│   │   ├── molecules/           ← Card, FormField, ListItem, Modal
│   │   ├── organisms/           ← Header, TabBar, ScreenWrapper
│   │   ├── onboarding/          ← PrimaryButton, ProgressIndicator, SelectionCard, GlassCard, OTPInput
│   │   └── dashboard/           ← CycleTrackerWidget, DietPreviewWidget, TodaysWorkoutWidget, etc.
│   │
│   ├── context/
│   │   ├── AuthContext.tsx       ← Firebase auth + Firestore flags
│   │   ├── UserContext.tsx       ← User profile state
│   │   └── ThemeContext.tsx      ← Dark/Light theme
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            ← Re-export from AuthContext
│   │   ├── useDashboardData.ts   ← Aggregate home screen data
│   │   ├── useCycleTracker.ts    ← Cycle state + prediction logic
│   │   └── useOnboarding.ts      ← Onboarding step state machine
│   │
│   ├── services/
│   │   ├── authService.ts        ← Firebase Auth operations
│   │   ├── userService.ts        ← Firestore user CRUD
│   │   ├── onboardingService.ts  ← Save questionnaire, assessment, goals
│   │   ├── lunaAiService.ts      ← Gemini AI integration (multi-model)
│   │   ├── aiCoachService.ts     ← Chat AI service
│   │   ├── goalService.ts        ← Goal tracking
│   │   └── notificationService.ts← Push notifications
│   │
│   ├── store/
│   │   ├── onboardingStore.ts    ← Zustand: onboarding step state
│   │   └── dashboardStore.ts     ← Zustand: dashboard cache
│   │
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── health.types.ts
│   │   └── navigation.types.ts
│   │
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── hormonalScore.ts
│   │   └── validators.ts
│   │
│   └── config/
│       ├── firebase.ts           ← Firebase app init
│       └── ai.ts                 ← Gemini model config
│
├── constants/
│   └── theme.ts                  ← Colors, Spacing, Typography, Radius, FontWeight
│
├── assets/
│   ├── fonts/
│   └── images/
│
├── app.json
├── eas.json
├── babel.config.js
├── tailwind.config.js
├── global.css
└── tsconfig.json
```

> **Cleanup:** Remove `tmp_screens/`, `download_screens.js`, `login.html`, `onboarding1.html`, `splash.html` — these are design prototypes and should not live in the production repo root.

---

## 🗓️ MVP Completion Roadmap (48-Hour Plan)

This roadmap assumes a functional developer targeting a **demo-ready, investor-showable MVP**.

---

### ⚡ Day 1 — Foundation & Core Fixes (0–24 hours)

#### Hour 0–4: Critical Bug Fixes
- [ ] **Create missing files** `ai-plan-generating.tsx` and `ai-plan-result.tsx` (simple placeholders first — loading animation + results card)
- [ ] **Fix root auth guard** in `app/index.tsx` — implement auth-state-based redirect:
  ```tsx
  // app/index.tsx
  const { user, onboardingComplete, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (user && onboardingComplete) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(onboarding)" />;
  ```
- [ ] **Fix `(auth)/index.tsx` Sign In CTA** — change `router.replace('/(setup)/profile')` → `router.replace('/(tabs)')`

#### Hour 4–8: Navigation Cleanup
- [ ] Delete `(app)/` legacy group and all its sub-screens
- [ ] Delete `(setup)/` legacy group
- [ ] Delete `app/login.tsx` and `app/modal.tsx` (root legacy files)
- [ ] Delete `(tabs)/two.tsx`
- [ ] Register `(auth)/otp-verify.tsx` in `(auth)/_layout.tsx` OR delete if unused
- [ ] Replace `expo-symbols` in `(tabs)/_layout.tsx` with `lucide-react-native` icons for Android compatibility

#### Hour 8–14: Complete Onboarding
- [ ] Implement `ai-plan-generating.tsx` — animated "Luna is building your plan" loading screen (3–4 second transition with Reanimated)
- [ ] Implement `ai-plan-result.tsx` — show AI-generated plan summary pulled from `lunaAiService.ts`
- [ ] Merge `questionnaire.tsx` data collection into `profile-details.tsx` — remove the standalone questionnaire screen as a separate step
- [ ] Standardize `ProgressIndicator` step counts across all onboarding screens (settle on 5 total steps)
- [ ] Write `onboardingComplete: true` to Firestore after `(program)/purchase.tsx` success

#### Hour 14–20: Standardize Styling
- [ ] Audit all onboarding screens — convert `StyleSheet.create()` usage to NativeWind `className` for consistency, OR do the reverse (pick one)
- [ ] Ensure all screens use `SafeAreaView` from `react-native-safe-area-context` consistently
- [ ] Fix `text-5xl`, `text-4xl` responsive sizing for smaller Android screens

#### Hour 20–24: State Wiring + Firebase
- [ ] Implement actual Firebase Auth in `(onboarding)/login.tsx` — Wire OTP send/verify to `authService.ts`
- [ ] Implement save to Firestore in `profile-details.tsx` → `userService.ts`
- [ ] Test full onboarding flow end-to-end on Android emulator

---

### 🚀 Day 2 — Feature Polish & Main App (24–48 hours)

#### Hour 24–30: Main App Screens
- [ ] Expand `(secondary)/doctor-booking.tsx` — build a simple doctor list + booking confirmation
- [ ] Expand `(secondary)/progress.tsx` — implement weight/cycle/workout charts using SVG or a chart library
- [ ] Expand `(secondary)/workout-detail.tsx` — show workout cards with sets/reps + `expo-av` video preview

#### Hour 30–36: AI Coach
- [ ] Complete `(modals)/ai-coach.tsx` — wire `aiCoachService.ts` to `react-native-gifted-chat` for working AI chat
- [ ] Add session persistence (chat history stored in AsyncStorage)

#### Hour 36–42: UX Polish
- [ ] Add skeleton loading states to Home Dashboard widgets
- [ ] Add pull-to-refresh on `(tabs)/index.tsx` dashboard
- [ ] Implement real `(tabs)/profile.tsx` — show user name, goals, edit profile CTA, logout
- [ ] Add haptic feedback on key actions (OTP submit, goal selection, AI plan reveal)
- [ ] Confirm push notification scheduling works after login

#### Hour 42–48: Quality Assurance
- [ ] Run end-to-end flow: Fresh install → Onboarding → Main App → AI Coach → Return to App
- [ ] Test on Android (physical device or emulator SDK 35)
- [ ] Test on iOS Simulator (iOS 15.1+)
- [ ] Fix `expo doctor` warnings (peer dependency version mismatches)
- [ ] Verify all Firestore security rules allow authenticated read/write for users' own documents
- [ ] Prepare EAS build for demo distribution

---

### 📊 MVP Feature Priority Matrix

| Feature | Priority | Effort | Status |
|---|---|---|---|
| Auth guard at root | Critical | 30 min | ❌ Missing |
| Missing AI screen files | Critical | 2 hrs | ❌ Missing |
| Fix Sign In routing | Critical | 10 min | 🐛 Broken |
| Remove duplicate Tab Nav | High | 1 hr | ⚠️ Legacy |
| Onboarding end-to-end | High | 6 hrs | ⚠️ Partial |
| Working AI Coach chat | High | 4 hrs | ⚠️ Partial |
| Android tab icons | High | 30 min | 🐛 Broken |
| Progress charts screen | Medium | 4 hrs | ⚠️ Stub |
| Doctor booking flow | Medium | 3 hrs | ⚠️ Stub |
| Styling consistency | Low | 3 hrs | ⚠️ Mixed |

---

## 🔐 Auth State Machine (Recommended)

```
Firebase Auth State
    │
    ├─► null (not logged in)
    │       └── Show: (onboarding)/index → login/register
    │
    ├─► User (logged in)
    │       ├─► onboardingComplete = false
    │       │       └── Show: (onboarding)/profile-setup → ... → (program)/purchase
    │       │
    │       ├─► onboardingComplete = true, subscriptionActive = false
    │       │       └── Show: (tabs)/ with subscription upsell banner
    │       │
    │       └─► onboardingComplete = true, subscriptionActive = true
    │               └── Show: (tabs)/ full access
    │
    └─► Loading → Show: Splash / Activity Indicator
```

---

## 📦 Key Dependencies Reference

| Package | Version | Purpose |
|---|---|---|
| `expo-router` | ~6.0.23 | File-based navigation |
| `firebase` | ^12.11.0 | Auth + Firestore backend |
| `@google/generative-ai` | ^0.24.1 | Gemini AI for health plans |
| `nativewind` | ^4.2.3 | Tailwind CSS for RN |
| `zustand` | ^5.0.12 | Global state management |
| `react-hook-form` | ^7.54.0 | Form state + validation |
| `zod` | ^4.3.6 | Schema validation |
| `react-native-reanimated` | ~4.1.7 | Smooth animations |
| `expo-notifications` | ~0.32.16 | Push notifications |
| `react-native-gifted-chat` | ^3.3.2 | AI Coach chat UI |
| `lucide-react-native` | ^1.7.0 | Cross-platform icons |
| `expo-symbols` | ~1.0.8 | ⚠️ iOS-only — replace for Android |

---

## 🧑‍💻 Development Commands

```bash
# Start development server
npm start         # expo start --clear

# Platform-specific
npm run android   # expo start --android
npm run ios       # expo start --ios

# Lint
npm run lint      # expo lint

# EAS Builds
npx eas-cli build --platform android --profile production
npx eas-cli build --platform ios --profile production

# Check for issues
npx expo-doctor
```

---

## 🏛️ Architecture Decisions

| Decision | Rationale |
|---|---|
| **Expo Router over React Navigation** | File-based routing = better DX, automatic deep linking, typed routes |
| **Firebase** | Real-time Firestore listeners in AuthContext eliminate polling for auth state |
| **NativeWind** | Tailwind mental model on Native — but mixing with `StyleSheet` creates tech debt |
| **Zustand** | Lightweight alternative to Redux for dashboard and onboarding state |
| **Gemini AI** | Multi-model support in `lunaAiService.ts` enables A/B testing across Gemini versions |
| **EAS Build** | Cloud builds avoid local Android SDK + Xcode setup complexity |

---

*Generated by AI Architecture Audit — Luna Wellness v2.4.0 — April 2026*
