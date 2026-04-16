import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LucideIcon, Flame, Coffee, Beef, Wheat, Carrot, Timer, Sparkles, ArrowRight } from 'lucide-react-native';

import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { OnboardingPlanResult } from '@/src/services/lunaAiService';

export default function AiPlanResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const aiPlan: OnboardingPlanResult = params.aiPlan
    ? JSON.parse(params.aiPlan as string)
    : {
      calorieRange: '1800-2000 kcal',
      macroSplit: { protein: '120g', fiber: '30g', carbs: '200g', fat: '60g' },
      timelineEstimate: { months: 3, description: 'Steady progress' },
      metabolicProfile: 'Balanced metabolic state.',
      hormonalRiskSignals: ['None'],
      planConfidenceScore: 95
    };

  const onContinue = () => {
    router.push('/(onboarding)/pricing');
  };

  return (
    <ScreenWrapper>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="py-8">
            <Animated.View entering={FadeInDown.duration(600).springify()}>
              <Text className="text-textSecondary text-[13px] uppercase font-bold tracking-[3px] mb-2">
                Your AI Blueprint
              </Text>
              <Text className="text-textPrimary text-[32px] font-extrabold leading-[40px] mb-6">
                Optimised for Your <Text className="text-primary">Hormones</Text>
              </Text>
            </Animated.View>

            {/* Calorie Card */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(600)}
              className="bg-surface rounded-[32px] p-8 mb-6 border border-white/5 relative overflow-hidden"
            >
              <View className="absolute top-0 right-0 p-4 opacity-10">
                <Flame size={120} color="#7C3AED" />
              </View>
              <Text className="text-textSecondary text-[14px] uppercase font-bold mb-2 tracking-wider">Target Daily Intake</Text>
              <Text className="text-textPrimary text-[40px] font-black mb-1">{aiPlan.calorieRange}</Text>
              <Text className="text-primary text-[14px] font-bold">Scientific metabolic baseline</Text>
            </Animated.View>

            {/* Macro Grid */}
            <View className="flex-row flex-wrap justify-between gap-4 mb-6">
              <MacroCard icon={Beef} label="Protein" value={aiPlan.macroSplit.protein} color="#EF4444" delay={200} />
              <MacroCard icon={Wheat} label="Carbs" value={aiPlan.macroSplit.carbs} color="#3B82F6" delay={300} />
              <MacroCard icon={Carrot} label="Fiber" value={aiPlan.macroSplit.fiber} color="#10B981" delay={400} />
              <MacroCard icon={Coffee} label="Fats" value={aiPlan.macroSplit.fat} color="#F59E0B" delay={500} />
            </View>

            {/* Insight Panel */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(600)}
              className="bg-surface/50 rounded-[32px] p-6 mb-6 border border-white/5"
            >
              <View className="flex-row items-center gap-3 mb-4">
                <View className="bg-primary/20 p-2 rounded-xl">
                  <Sparkles size={20} color="#7C3AED" />
                </View>
                <Text className="text-textPrimary text-[18px] font-bold">Metabolic Insight</Text>
              </View>
              <Text className="text-textSecondary text-[15px] leading-[22px] mb-6">
                {aiPlan.metabolicProfile}
              </Text>

              <View className="flex-row items-center gap-3 mb-4">
                <View className="bg-primary/20 p-2 rounded-xl">
                  <Timer size={20} color="#7C3AED" />
                </View>
                <Text className="text-textPrimary text-[18px] font-bold">Expected Timeline</Text>
              </View>
              <Text className="text-textSecondary text-[15px] leading-[22px]">
                {aiPlan.timelineEstimate.months} Months – {aiPlan.timelineEstimate.description}
              </Text>
            </Animated.View>

            {/* Risk Signals */}
            {aiPlan.hormonalRiskSignals.length > 0 && aiPlan.hormonalRiskSignals[0] !== 'None' && (
              <Animated.View
                entering={FadeInDown.delay(700).duration(600)}
                className="bg-red-500/10 rounded-[24px] p-5 mb-10 border border-red-500/20"
              >
                <Text className="text-red-400 text-[13px] uppercase font-bold mb-3 tracking-wider">Hormonal Risk Flags</Text>
                {aiPlan.hormonalRiskSignals.map((signal, i) => (
                  <View key={i} className="flex-row gap-2 mb-2">
                    <Text className="text-red-300">•</Text>
                    <Text className="text-red-300/80 text-[14px] flex-1 leading-[20px]">{signal}</Text>
                  </View>
                ))}
              </Animated.View>
            )}

            <View className="h-24" />
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 p-6 bg-background/80" style={{ backdropFilter: 'blur(20px)' }}>
          <PrimaryButton
            title="Unlock My Full Plan"
            onPress={onContinue}
            icon={<ArrowRight size={20} color="#FFF" />}
          />
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

function MacroCard({ icon: Icon, label, value, color, delay }: { icon: any, label: string, value: string, color: string, delay: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600).springify()}
      className="bg-surface rounded-[24px] p-5 w-[47%] border border-white/5"
    >
      <View style={{ backgroundColor: `${color}20` }} className="p-2 rounded-xl self-start mb-3">
        <Icon size={18} color={color} />
      </View>
      <Text className="text-textSecondary text-[13px] font-medium mb-1">{label}</Text>
      <Text className="text-textPrimary text-[18px] font-black">{value}</Text>
    </Animated.View>
  );
}
