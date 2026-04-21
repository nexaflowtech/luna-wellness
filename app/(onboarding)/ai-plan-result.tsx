import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// Reanimated removed - plain View used instead
import { LucideIcon, Sparkles, ArrowRight, Brain, Timer, Zap, Dumbbell, Utensils, Headset } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/src/context/AuthContext';

const { width } = Dimensions.get('window');

export default function AiPlanResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse dynamic AI generated plan
  let aiPlan = {
    calorieRange: '1850-2050 kcal',
    objective: 'Sustainable Vitality',
    objectiveDesc: 'Focused on metabolic health and lean muscle retention through caloric cycling.',
    targetResult: 'Loading...',
    timeline: 'in 12 weeks',
    confidenceScore: 98.4,
    insight: "Based on your biological markers, we've structured a plan that optimizes for your current metabolic state.",
    workout_type: 'Custom Workout',
    diet_type: 'Personalized Diet'
  };

  if (params.aiPlan) {
    try {
      const parsed = JSON.parse(params.aiPlan as string);
      aiPlan.confidenceScore = parsed.planConfidenceScore || 98.4;
      aiPlan.objective = parsed.diet_type || 'Metabolic Optimization';
      aiPlan.objectiveDesc = `This dynamic protocol provides a ${parsed.calorieRange} framework utilizing ${parsed.workout_type || 'adaptive intervals'}.`;
      aiPlan.targetResult = parsed.expected_result || aiPlan.targetResult;
      aiPlan.timeline = ''; // already baked into expected_result
      aiPlan.insight = parsed.metabolicProfile || aiPlan.insight;
      aiPlan.workout_type = parsed.workout_type || 'Custom Workout';
      aiPlan.diet_type = parsed.diet_type || 'Personalized Diet';
    } catch (e) {
      console.error("Failed to parse aiPlan", e);
    }
  }

  const onContinue = () => {
    router.push('/(onboarding)/pricing');
  };

  return (
    <View className="flex-1 bg-surface-bright">
      {/* Header Branding */}
      <View className="w-full px-8 pt-16 pb-6 bg-surface-bright flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <Sparkles color="#006e2f" size={24} />
          <Text className="text-xl font-extrabold text-on-surface tracking-tighter">Luna Wellness</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View>
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1">
              <Text className="text-[40px] font-extrabold text-on-surface tracking-tighter leading-[48px]">
                Your Personalized Luna Plan
              </Text>
              <Text className="text-on-surface-variant text-lg leading-relaxed font-medium mt-4">
                We've analyzed 42 of your health markers to craft a journey that respects your rhythm.
              </Text>
            </View>

            {/* AI Confidence Chip */}
            <View className="bg-surface-container-lowest p-4 rounded-[24px] border border-white items-center shadow-md">
              <View className="w-10 h-10 bg-[#e6f0ea] rounded-xl items-center justify-center mb-1">
                <Sparkles color="#006e2f" size={18} />
              </View>
              <Text className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Confidence</Text>
              <Text className="text-base font-extrabold text-on-surface">{aiPlan.confidenceScore}%</Text>
            </View>
          </View>
        </View>

        {/* Summary Bento Grid */}
        <View className="flex-col gap-6 mb-12">
          {/* Main Objective Card */}
          <View>
            <View className="relative z-10">
              <View className="bg-[#e6f1f0] px-4 py-1.5 rounded-full self-start mb-6">
                <Text className="text-secondary text-[10px] font-bold uppercase tracking-[2px]">Primary Objective</Text>
              </View>
              <Text className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">{aiPlan.objective}</Text>
              <Text className="text-on-surface-variant text-sm font-medium leading-[20px] max-w-[240px]">
                {aiPlan.objectiveDesc}
              </Text>

              <View className="mt-10 flex-row items-baseline gap-2">
                <Text className="text-[32px] font-extrabold text-primary tracking-tighter shrink">{aiPlan.targetResult}</Text>
              </View>
            </View>

            {/* Decor Glow */}
            <View className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </View>

          {/* AI Insight Card */}
          <View>
            <View className="w-12 h-12 bg-[#dce9ff] rounded-2xl items-center justify-center">
              <Brain color="#005ac2" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-extrabold text-on-tertiary-container tracking-tight">AI Insight</Text>
              <Text className="text-on-tertiary-container text-sm leading-relaxed font-bold mt-1">
                {aiPlan.insight}
              </Text>
            </View>
          </View>
        </View>

        {/* What's Included Section */}
        <View className="mb-12">
          <View className="flex-row items-center gap-4 mb-8">
            <Text className="text-xl font-extrabold text-on-surface tracking-tight">What's Included</Text>
            <View className="h-[1px] flex-1 bg-surface-container-highest" />
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            <FeatureCard
              icon={Dumbbell}
              title={aiPlan.workout_type}
              desc="Dynamic routines that adapt daily."
              color="#006e2f"
              delay={300}
            />
            <FeatureCard
              icon={Utensils}
              title={aiPlan.diet_type}
              desc="Chef-curated macros for your bio-markers."
              color="#006b5f"
              delay={400}
            />
            <FeatureCard
              icon={Headset}
              title="1-on-1 Support"
              desc="Direct access to human expertise."
              color="#005ac2"
              delay={500}
            />
            <FeatureCard
              icon={Zap}
              title="24/7 AI Coach"
              desc="Instant responses to your health q's."
              color="#006f64"
              delay={600}
            />
          </View>
        </View>

        {/* Roadmap Section */}
        <View>
          <Text className="text-2xl font-extrabold text-on-surface tracking-tight mb-10">Your 12-Week Roadmap</Text>

          <RoadmapStep
            num={1}
            title="Foundation"
            desc="Weeks 1-4. Focus on mobility, habit stacking, and metabolic priming."
            active
          />
          <View className="h-4" />
          <RoadmapStep
            num={2}
            title="Intensification"
            desc="Weeks 5-8. Peak metabolic load with compound strength training."
          />
          <View className="h-4" />
          <RoadmapStep
            num={3}
            title="Sustainability"
            desc="Weeks 9-12. Transitioning to long-term maintenance protocols."
          />
        </View>

      </ScrollView>

      {/* CTA Section */}
      <View className="absolute bottom-0 left-0 w-full p-8 bg-surface-bright">
        <TouchableOpacity
          className="rounded-[28px] overflow-hidden shadow-md"
          onPress={onContinue}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#006e2f', '#006b5f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full py-6 items-center justify-center flex-row gap-3"
          >
            <Text className="text-white font-extrabold text-xl tracking-tight">Start My Plan</Text>
            <ArrowRight color="white" size={24} />
          </LinearGradient>
        </TouchableOpacity>
        <Text className="text-center text-on-surface-variant text-[11px] font-bold mt-6 uppercase tracking-widest">
          Risk-free 7-day adjustment period included.
        </Text>
      </View>
    </View>
  );
}

function FeatureCard({ icon: Icon, title, desc, color, delay }: any) {
  return (
    <View>
      <View style={{ backgroundColor: `${color}10` }} className="w-12 h-12 rounded-2xl items-center justify-center mb-6">
        <Icon color={color} size={24} />
      </View>
      <Text className="text-on-surface font-extrabold text-base tracking-tight leading-tight">{title}</Text>
      <Text className="text-on-surface-variant text-[11px] font-bold leading-[16px] mt-2">{desc}</Text>
    </View>
  );
}

function RoadmapStep({ num, title, desc, active = false }: any) {
  return (
    <View className="flex-row gap-5">
      <View className="items-center">
        {active ? (
          <LinearGradient
            colors={['#006e2f', '#006b5f']}
            className="w-10 h-10 rounded-full items-center justify-center shadow-md"
          >
            <Text className="text-white font-black text-lg">{num}</Text>
          </LinearGradient>
        ) : (
          <View className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-[#e6f0ea] items-center justify-center">
            <Text className="text-primary font-black text-lg">{num}</Text>
          </View>
        )}
        <View className="w-[2px] flex-1 bg-[#e6f0ea] my-2" />
      </View>
      <View className="flex-1 pt-1">
        <Text className="text-on-surface font-extrabold text-lg tracking-tight">{title}</Text>
        <Text className="text-on-surface-variant text-[13px] font-medium leading-[20px] mt-1">{desc}</Text>
      </View>
    </View>
  );
}
