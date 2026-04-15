import React, { useEffect, useState } from 'react';
import { View, Alert, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { LunaAiService } from '@/src/services/lunaAiService';
import { saveProfileSetup, saveQuestionnaire, saveAiPlan } from '@/src/services/onboardingService';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing, FadeInDown
} from 'react-native-reanimated';
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

  const scanLineY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.1);

  const scanLineStyle = useAnimatedStyle(() => ({ top: `${scanLineY.value}%` }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  useEffect(() => {
    scanLineY.value = withRepeat(withTiming(100, { duration: 1800, easing: Easing.linear }), -1, false);
    glowOpacity.value = withRepeat(withSequence(withTiming(0.4, { duration: 1200 }), withTiming(0.1, { duration: 1200 })), -1, true);
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
          // Push to generation screen and pass params along
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

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center p-8 overflow-hidden">
        {/* Deep background ambient glow */}
        <Animated.View style={[glowStyle, { position: 'absolute', width: '150%', aspectRatio: 1, borderRadius: 9999, backgroundColor: 'rgba(34,197,94,0.06)', top: '10%' }]} />

        <Animated.View entering={FadeInDown.duration(600).springify()} className="w-full h-[55%] relative rounded-[32px] overflow-hidden mb-12 bg-surface border border-accent/20" style={{
           shadowColor: '#22C55E',
           shadowOffset: { width: 0, height: 10 },
           shadowOpacity: 0.1,
           shadowRadius: 30,
           elevation: 10
        }}>
          <BodyPreview3D bmi={bmi} isLoading={true} />
          <View className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent pointer-events-none" />

          {/* Mint scanning beam */}
          <Animated.View style={[scanLineStyle, { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#22C55E', shadowColor: '#22C55E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 16, elevation: 8 }]} />
          <Animated.View style={[scanLineStyle, { position: 'absolute', left: 0, right: 0, height: 80, marginTop: -80, backgroundColor: 'rgba(34,197,94,0.1)' }]} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="items-center w-full">
          <ActivityIndicator size="large" color="#22C55E" style={{ marginBottom: 24, transform: [{ scale: 1.2 }] }} />
          <Animated.Text key={stepIndex} entering={FadeInDown.duration(400)} className="text-accent text-[22px] font-extrabold text-center mb-3">
            {STEPS[stepIndex]}
          </Animated.Text>
          <Text className="text-textSecondary text-[15px] text-center leading-[22px] px-4">
            Please wait while our Luna AI engine creates your personalized daily blueprint...
          </Text>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}
