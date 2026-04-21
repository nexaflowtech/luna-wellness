import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// Reanimated removed - plain View used instead
import { Sparkles, RefreshCw } from 'lucide-react-native';

import { useAuth } from '@/src/context/AuthContext';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { LunaAiService } from '@/src/services/lunaAiService';
import { saveAiPlan } from '@/src/services/onboardingService';

// Rotating status messages to show during generation
const STATUS_MESSAGES = [
  'Analyzing your health profile...',
  'Calibrating nutrition macros...',
  'Optimizing workout protocol...',
  'Assessing hormonal markers...',
  'Finalizing your custom plan...',
];

export default function AiPlanGeneratingScreen() {
  const router = useRouter();
  const { user, gender: contextGender } = useAuth();
  const { gender: storeGender, height, weight, bmi, goal, activity, diet, sleep, stress } = useOnboardingStore();

  const [statusIndex, setStatusIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const hasFired = useRef(false);

  const resolvedGender = (storeGender || contextGender || 'female') as 'male' | 'female' | 'other';

  useEffect(() => {
    // Rotate status messages every 1.8 seconds
    const msgInterval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 1800);
    return () => clearInterval(msgInterval);
  }, []);

  const runGeneration = async () => {
    if (hasFired.current) return;
    hasFired.current = true;
    setHasError(false);

    try {
      const profile = {
        age: 28, // Default age — can be extended when profile details screen collects it
        gender: resolvedGender,
        heightCm: height ?? 170,
        weightKg: weight ?? 70,
        targetWeightKg: goal?.toLowerCase().includes('loss') ? (weight ?? 70) - 8 : (weight ?? 70) + 2,
        primaryGoals: goal ? [goal] : [],
        adaptiveAnswers: {
          activityLevel: activity ?? '',
          foodPreference: diet ?? '',
          sleepQuality: sleep ?? '',
          stressLevel: stress ?? '',
        },
      };

      const plan = await LunaAiService.generateOnboardingPlan(profile);

      // Persist plan to Firestore
      if (user?.uid) {
        await saveAiPlan(user.uid, {
          ...plan,
          goal: goal,
          generatedAt: new Date().toISOString(),
        });
      }

      // Navigate with plan data as route params
      router.replace({
        pathname: '/(onboarding)/ai-plan-result',
        params: { aiPlan: JSON.stringify(plan) },
      });
    } catch (err: any) {
      console.error('[AiPlanGenerating] Generation failed:', err);
      setHasError(true);
      setErrorMsg(err?.message || 'Something went wrong generating your plan.');
      hasFired.current = false; // Allow retry
    }
  };

  useEffect(() => {
    runGeneration();
  }, []);

  if (hasError) {
    return (
      <View className="flex-1 items-center justify-center p-8 bg-surface-bright">
        <View>
          <View className="w-20 h-20 rounded-[24px] bg-error/10 items-center justify-center mb-8">
            <Text className="text-5xl">⚠️</Text>
          </View>
          <Text className="text-on-surface text-2xl font-extrabold text-center mb-3 tracking-tighter">
            Something went wrong
          </Text>
          <Text className="text-on-surface-variant text-sm text-center leading-6 mb-10 px-4">
            {errorMsg}
          </Text>
          <TouchableOpacity
            onPress={runGeneration}
            className="flex-row items-center gap-3 bg-primary px-8 py-4 rounded-2xl"
            activeOpacity={0.85}
          >
            <RefreshCw color="white" size={18} />
            <Text className="text-white font-extrabold text-base">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-8 bg-surface-bright">
      <View>
        {/* Icon */}
        <View>
          <Sparkles size={48} color="#006e2f" />
        </View>

        {/* Title */}
        <Text className="text-on-surface text-[32px] font-extrabold text-center mb-4 tracking-tighter">
          Calibrating AI Plan
        </Text>

        {/* Rotating status */}
        <View>
          <Text className="text-on-surface-variant text-[16px] text-center leading-[24px] px-8 font-medium">
            {STATUS_MESSAGES[statusIndex]}
          </Text>
        </View>

        {/* Progress indicator */}
        <View className="mt-16 items-center">
          <ActivityIndicator color="#006e2f" size="large" />
          <Text className="text-primary font-bold text-[10px] uppercase tracking-[3px] mt-6">
            Analyzing 42 Health Markers
          </Text>
        </View>

        {/* Plan preview chips */}
        <View>
          {['Nutrition', 'Workout', 'Hormones', 'Lifestyle'].map((tag) => (
            <View key={tag} className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Text className="text-primary text-xs font-bold tracking-wide">{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
