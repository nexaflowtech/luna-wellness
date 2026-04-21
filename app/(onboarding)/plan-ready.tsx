import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Target, TrendingDown, Sparkles } from 'lucide-react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';

export default function PlanReadyScreen() {
  const router = useRouter();
  const { aiPlan, goals } = useLocalSearchParams();
  const planData = aiPlan ? JSON.parse(aiPlan as string) : null;
  const primaryGoal = planData?.summary?.primaryFocus || goals || 'Weight Loss & Toning';

  const handleStart = () => { router.replace('/(tabs)'); };

  const ListItem = ({ text }: { text: string }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(34,197,94,0.2)', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle2 color="#22C55E" size={14} strokeWidth={3} />
      </View>
      <Text className="text-textPrimary text-[15px] ml-4 font-semibold">{text}</Text>
    </View>
  );

  return (
    <ScreenWrapper>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View className="items-center mb-10">
          <View className="w-24 h-24 rounded-full items-center justify-center mb-6 bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/30">
            <Sparkles color="#7C3AED" size={44} />
          </View>
          <Text className="text-textPrimary text-[34px] leading-[42px] font-black text-center mb-3 tracking-tight">Your Protocol is Generated</Text>
          <Text className="text-textSecondary text-[16px] leading-[24px] text-center px-4">
            We've analyzed your profile and crafted a customized daily protocol to hit your targets efficiently.
          </Text>
        </View>

        {/* Gradient border card */}
        <View>
          <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-[1px] rounded-[32px]">
            <View className="bg-surface rounded-[31px] p-7">

              <View className="flex-row items-center mb-8">
                <View className="w-12 h-12 rounded-2xl bg-secondary/10 items-center justify-center border border-secondary/20">
                  <Target color="#F472B6" size={24} />
                </View>
                <View className="ml-5 flex-1">
                  <Text className="text-textSecondary text-[12px] uppercase tracking-widest font-extrabold mb-1.5">Primary Goal Track</Text>
                  <Text className="text-textPrimary text-[18px] font-black capitalize">{primaryGoal}</Text>
                </View>
              </View>

              <View className="flex-row items-center mb-8">
                <View className="w-12 h-12 rounded-2xl bg-accent/10 items-center justify-center border border-accent/20">
                  <TrendingDown color="#22C55E" size={24} />
                </View>
                <View className="ml-5 flex-1">
                  <Text className="text-textSecondary text-[12px] uppercase tracking-widest font-extrabold mb-1.5">Expected Timeline</Text>
                  <Text className="text-accent text-[18px] font-black">See progress in 14–21 days</Text>
                </View>
              </View>

              <View className="h-[1px] bg-white/10 mb-8" />

              <Text className="text-textSecondary text-[12px] uppercase tracking-widest font-extrabold mb-6">What's Included</Text>
              <View className="ml-1">
                <ListItem text="Personalized Daily Workout Routine" />
                <ListItem text="Adaptive Nutrition Framework" />
                <ListItem text="24/7 AI Coach Access" />
              </View>

            </View>
          </LinearGradient>
        </View>

      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 py-8 bg-background border-t border-white/5">
        <PrimaryButton title="Enter the Dashboard" onPress={handleStart} />
      </View>
    </ScreenWrapper>
  );
}


