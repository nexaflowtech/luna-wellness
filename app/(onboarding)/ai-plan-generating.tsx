import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeOut, FadeInDown } from 'react-native-reanimated';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { CheckCircle2 } from 'lucide-react-native';

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
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center p-8 bg-background">
        <Animated.View
          entering={FadeIn.duration(800)}
          exiting={FadeOut.duration(400)}
          className="items-center"
        >
          <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center mb-8 border border-primary/30">
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <CheckCircle2 size={48} color="#7C3AED" />
            </Animated.View>
          </View>

          <Text className="text-textPrimary text-[28px] font-extrabold text-center mb-4">
            Plan Generated!
          </Text>

          <Text className="text-textSecondary text-[16px] text-center leading-[24px] px-4">
            Luna AI has successfully analyzed your health profile and created your custom blueprint.
          </Text>

          <View className="mt-12 flex-row gap-3">
            <View className="w-2 h-2 rounded-full bg-primary" />
            <View className="w-2 h-2 rounded-full bg-primary/50" />
            <View className="w-2 h-2 rounded-full bg-primary/20" />
          </View>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}
