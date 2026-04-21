import React, { useEffect, useState, useRef } from 'react';
import { View, Alert, Text, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { LunaAiService } from '@/src/services/lunaAiService';
import { saveProfileSetup, saveQuestionnaire, saveAiPlan } from '@/src/services/onboardingService';
import { BodyPreview3D } from '@/src/components/onboarding/BodyPreview3D';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';

const STEPS = [
  'Analyzing your body metrics...',
  'Calculating metabolic rate...',
  'Building hormonal profile...',
  'Personalizing your journey...',
];

export default function AiLoadingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [stepIndex, setStepIndex] = useState(0);

  // Plain RN Animated values — no Reanimated / TurboModule needed
  const scanLineY = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    // Scan line loop
    Animated.loop(
      Animated.timing(scanLineY, { toValue: 1, duration: 1800, useNativeDriver: false })
    ).start();

    // Glow pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function processAiPlan() {
      if (!user) return;
      try {
        const profileData = {
          age: parseInt(params.age as string || '25'),
          gender: (params.gender as any) || 'female',
          heightCm: parseInt(params.heightCm as string || '165'),
          weightKg: parseInt(params.weightKg as string || '60'),
          targetWeightKg: parseInt(params.desiredWeightKg as string || '55'),
          primaryGoals: (params.goals as string || '').split(',').filter(Boolean),
          adaptiveAnswers: params.adaptive ? JSON.parse(decodeURIComponent(params.adaptive as string)) : {},
        };
        const aiPlan = await LunaAiService.generateOnboardingPlan(profileData);
        await saveProfileSetup(user.uid, {
          name: user.displayName || 'Luna Member',
          age: profileData.age, gender: profileData.gender,
          heightCm: profileData.heightCm, weightKg: profileData.weightKg,
          primaryGoals: profileData.primaryGoals, dynamicDetails: profileData.adaptiveAnswers,
        });
        await saveQuestionnaire(user.uid, {
          cycleInfo: params.cycle as string || '',
          dietPreference: params.diet as string || '',
          lifestyleHabits: (params.habits as string || '').split(',').filter(Boolean),
          primaryGoals: profileData.primaryGoals,
        });
        await saveAiPlan(user.uid, aiPlan);
        setTimeout(() => {
          router.replace({ pathname: '/(onboarding)/ai-plan-generating', params: { ...params, aiPlan: JSON.stringify(aiPlan) } });
        }, 1500);
      } catch (err) {
        console.error('[AiLoading] Error:', err);
        Alert.alert('Analysis Failed', 'There was an issue creating your personalized plan.', [
          { text: 'Retry', onPress: () => processAiPlan() },
          { text: 'Go Back', onPress: () => router.back() }
        ]);
      }
    }
    processAiPlan();
  }, [user, params]);

  const bmi = parseFloat(params.bmi as string || '22');

  // Interpolate scan line from 0% → 100%
  const scanTop = scanLineY.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Glow */}
        <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

        {/* Body preview card */}
        <Animated.View style={[styles.previewCard, { opacity: fadeAnim }]}>
          <BodyPreview3D bmi={bmi} isLoading={true} />
          <Animated.View style={[styles.scanLine, { top: scanTop }]} />
          <Animated.View style={[styles.scanBeam, { top: scanTop }]} />
        </Animated.View>

        {/* Step text */}
        <Animated.View style={[styles.textArea, { opacity: fadeAnim }]}>
          <ActivityIndicator size="large" color="#22C55E" style={styles.spinner} />
          <Text style={styles.stepText}>{STEPS[stepIndex]}</Text>
          <Text style={styles.bodyText}>
            Please wait while our Luna AI engine creates your personalized daily blueprint...
          </Text>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, overflow: 'hidden' },
  glow: { position: 'absolute', width: '150%', aspectRatio: 1, borderRadius: 9999, backgroundColor: 'rgba(34,197,94,0.06)', top: '10%' },
  previewCard: { width: '100%', height: '55%', borderRadius: 32, overflow: 'hidden', marginBottom: 48, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)', elevation: 10 },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#22C55E', elevation: 8 },
  scanBeam: { position: 'absolute', left: 0, right: 0, height: 80, marginTop: -80, backgroundColor: 'rgba(34,197,94,0.1)' },
  textArea: { alignItems: 'center', width: '100%' },
  spinner: { marginBottom: 24, transform: [{ scale: 1.2 }] },
  stepText: { color: '#22C55E', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  bodyText: { color: '#9ca3af', fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },
});
