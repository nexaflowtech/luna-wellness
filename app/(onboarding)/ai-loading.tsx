import React, { useEffect, useState } from 'react';
import { View, Alert, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { LunaAiService } from '@/src/services/lunaAiService';
import { saveProfileSetup, saveQuestionnaire, saveAiPlan } from '@/src/services/onboardingService';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from 'react-native-reanimated';
import { BodyPreview3D } from '@/src/components/onboarding/BodyPreview3D';

const STEPS = [
  'Analyzing your body...',
  'Calculating your BMI...',
  'Building your plan...',
];

export default function AiLoadingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [stepIndex, setStepIndex] = useState(0);

  const scanLineY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.1);

  const scanLineStyle = useAnimatedStyle(() => ({ top: `${scanLineY.value}%` }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  useEffect(() => {
    scanLineY.value = withRepeat(withTiming(100, { duration: 1800, easing: Easing.linear }), -1, false);
    glowOpacity.value = withRepeat(withSequence(withTiming(0.5, { duration: 1200 }), withTiming(0.1, { duration: 1200 })), -1, true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2000);
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
          router.replace({ pathname: '/(onboarding)/plan-ready', params: { aiPlan: JSON.stringify(aiPlan) } });
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

  return (
    <View style={{ flex: 1, backgroundColor: '#080B14', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      {/* Mint ambient glow */}
      <Animated.View style={[glowStyle, { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(110,231,183,0.08)', top: '25%' }]} />

      <View style={{ width: '100%', height: '52%', position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 40, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(110,231,183,0.1)' }}>
        <BodyPreview3D bmi={bmi} isLoading={true} />

        {/* Mint scanning beam */}
        <Animated.View style={[scanLineStyle, { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#6EE7B7', shadowColor: '#6EE7B7', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 12, elevation: 4 }]} />
        <Animated.View style={[scanLineStyle, { position: 'absolute', left: 0, right: 0, height: 48, marginTop: -48, backgroundColor: 'rgba(110,231,183,0.07)' }]} />
      </View>

      <ActivityIndicator size="large" color="#6EE7B7" style={{ marginBottom: 20 }} />
      <Text style={{ color: '#6EE7B7', fontSize: 19, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
        {STEPS[stepIndex]}
      </Text>
      <Text style={{ color: '#64748B', fontSize: 14, textAlign: 'center' }}>
        Please wait while our AI engine creates your personalized journey...
      </Text>
    </View>
  );
}
