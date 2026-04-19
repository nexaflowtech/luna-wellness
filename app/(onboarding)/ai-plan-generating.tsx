import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeOut, ScaleInCenter } from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';

export default function AiPlanGeneratingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: '/(onboarding)/ai-plan-result',
        params: params,
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, [params]);

  return (
    <View className="flex-1 items-center justify-center p-8 bg-surface-bright">
      <Animated.View
        entering={FadeIn.duration(800)}
        exiting={FadeOut.duration(400)}
        className="items-center"
      >
        <Animated.View
          entering={ScaleInCenter.delay(200).duration(600)}
          className="w-24 h-24 rounded-[32px] bg-primary/10 items-center justify-center mb-10 shadow-2xl shadow-primary/10"
        >
          <Sparkles size={48} color="#006e2f" />
        </Animated.View>

        <Text className="text-on-surface text-[32px] font-extrabold text-center mb-4 tracking-tighter">
          Calibrating AI Plan
        </Text>

        <Text className="text-on-surface-variant text-[16px] text-center leading-[24px] px-8 font-medium">
          Luna AI is successfully analyzing your health profile to create your custom blueprint.
        </Text>

        <View className="mt-16 items-center">
          <ActivityIndicator color="#006e2f" size="large" />
          <Text className="text-primary font-bold text-[10px] uppercase tracking-[3px] mt-6">
            Analyzing 42 Health Markers
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
