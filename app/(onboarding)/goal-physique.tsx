import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf, Scale, HeartPulse, Dumbbell, Sparkles, Check, ChevronLeft, ArrowRight } from 'lucide-react-native';

import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { useOnboardingStore } from '@/src/store/onboardingStore';

const MALE_GOALS = [
  { id: 'Muscle Gain', label: 'Muscle Gain', desc: 'Build Lean Mass', Icon: Dumbbell, color: '#006e2f' },
  { id: 'Weight Loss', label: 'Weight Loss', desc: 'Sustainable Vitality', Icon: Scale, color: '#006b5f' },
  { id: 'Performance', label: 'Performance', desc: 'Strength & Power', Icon: HeartPulse, color: '#005ac2' },
  { id: 'Fitness', label: 'Endurance', desc: 'Stamina & Energy', Icon: Leaf, color: '#006f64' },
];

const FEMALE_GOALS = [
  { id: 'PCOS', label: 'PCOS', desc: 'Hormonal Balance', Icon: Leaf, color: '#006b5f' },
  { id: 'Weight Loss', label: 'Weight Loss', desc: 'Sustainable Vitality', Icon: Scale, color: '#006e2f' },
  { id: 'Thyroid', label: 'Thyroid', desc: 'Metabolic Support', Icon: HeartPulse, color: '#005ac2' },
  { id: 'Fitness', label: 'Fitness', desc: 'Strength & Stamina', Icon: Dumbbell, color: '#006f64' },
];

const OTHER_GOALS = [
  { id: 'Holistic Health', label: 'Holistic Health', desc: 'Total Wellness', Icon: Leaf, color: '#006b5f' },
  { id: 'Weight Loss', label: 'Weight Loss', desc: 'Sustainable Vitality', Icon: Scale, color: '#006e2f' },
  { id: 'Immunity', label: 'Immunity', desc: 'System Support', Icon: HeartPulse, color: '#005ac2' },
  { id: 'Fitness', label: 'Fitness', desc: 'Strength & Stamina', Icon: Dumbbell, color: '#006f64' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Minimal activity' },
  { id: 'moderate', label: 'Moderately Active', desc: 'Daily walks/exercise' },
  { id: 'high', label: 'Highly Active', desc: 'Intense daily training' },
];

const SLEEP_LEVELS = [
  { id: 'poor', label: 'Poor (< 5 hrs)' },
  { id: 'average', label: 'Average (5-7 hrs)' },
  { id: 'good', label: 'Good (7-9 hrs)' },
];

const STRESS_LEVELS = [
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high', label: 'High' },
];

const DIETS = [
  { id: 'omnivore', label: 'Omnivore' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
];

export default function GoalPhysiqueScreen() {
  const router = useRouter();
  const { user, gender } = useAuth();

  const { goal, activity: storedAct, diet: storedDiet, sleep: storedSleep, stress: storedStress, setGoal, setLifestyle } = useOnboardingStore();

  const [selectedGoal, setSelectedGoal] = useState<string | null>(goal || null);
  const [activity, setActivity] = useState<string | null>(storedAct || null);
  const [diet, setDiet] = useState<string | null>(storedDiet || null);
  const [sleep, setSleep] = useState<string | null>(storedSleep || null);
  const [stress, setStress] = useState<string | null>(storedStress || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = selectedGoal && activity && diet && sleep && stress;

  const currentGoals = gender === 'male' ? MALE_GOALS : gender === 'other' ? OTHER_GOALS : FEMALE_GOALS;

  const handleNext = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);

    if (user?.uid) {
      updateUserDoc(user.uid, {
        goal: selectedGoal,
        lifestyle_data: {
          activityLevel: activity,
          foodPreference: diet,
          sleepQuality: sleep,
          stressLevel: stress
        },
        onboardingStep: '/(onboarding)/ai-plan-generating',
      }).catch(err => console.error('goal-physique write failed:', err));
    }

    setGoal(selectedGoal);
    setLifestyle('activity', activity);
    setLifestyle('diet', diet);
    setLifestyle('sleep', sleep);
    setLifestyle('stress', stress);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/(onboarding)/ai-plan-generating');
    }, 400);
  };

  return (
    <View className="flex-1 bg-surface-bright">
      {/* Transactional Progress Header (Steps 3 & 4 essentially completed) */}
      <View className="w-full px-8 pt-16 pb-6 flex-row items-center gap-2 bg-surface-bright">
        <View className="h-1 flex-1 bg-primary rounded-full" />
        <View className="h-1 flex-1 bg-primary rounded-full" />
        <View className="h-1 flex-1 bg-primary rounded-full" />
        <View className="h-1 flex-1 bg-primary rounded-full" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header Section */}
        <View className="mb-10 mt-4">
          <Text className="text-[40px] font-extrabold text-on-surface tracking-tighter leading-[48px] mb-4">
            Refining Your Path
          </Text>
          <Text className="text-on-surface-variant text-lg leading-relaxed font-medium">
            Customize Luna Wellness to your unique rhythm and health objectives.
          </Text>
        </View>

        {/* Primary Objective Grid */}
        <View className="mb-12">
          <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[2px] mb-6">Primary Objective</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {currentGoals.map((goal, idx) => {
              const isActive = selectedGoal === goal.id;
              return (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.9}
                  className={`relative w-[48%] p-6 rounded-[32px] border-2 ${isActive ? 'border-primary bg-surface-container-lowest shadow-sm' : 'border-transparent bg-surface-container-low'
                    }`}
                >
                  <View
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: isActive ? 'rgba(0, 110, 47, 0.1)' : 'white' }}
                  >
                    <goal.Icon color={isActive ? '#006e2f' : goal.color} size={24} />
                  </View>
                  <Text className="font-extrabold text-lg text-on-surface tracking-tight leading-tight">{goal.label}</Text>
                  <Text className="text-[11px] text-on-surface-variant mt-1 font-bold">{goal.desc}</Text>

                  <View className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 items-center justify-center ${isActive ? 'bg-primary border-primary' : 'border-outline-variant/50'}`}>
                    {isActive && <Check color="white" size={12} strokeWidth={4} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Lifestyle & Rhythm Section */}
        <View className="mb-12">
          <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[2px] mb-6">Lifestyle Insights</Text>

          {/* Daily Activity Container */}
          <View className="bg-surface-container-low rounded-[40px] p-8 mb-6 border border-white/50">
            <Text className="text-xl font-extrabold text-on-surface tracking-tight mb-6">Daily Activity</Text>
            <View className="flex-col gap-4">
              {ACTIVITY_LEVELS.map((lvl) => {
                const isActive = activity === lvl.id;
                return (
                  <TouchableOpacity
                    key={lvl.id}
                    onPress={() => setActivity(lvl.id)}
                    activeOpacity={0.8}
                    className={`w-full flex-row justify-between items-center px-6 py-5 rounded-[24px] border-2 ${isActive ? 'bg-surface-container-lowest border-primary shadow-sm' : 'bg-surface-container-lowest/50 border-transparent'
                      }`}
                  >
                    <View>
                      <Text className={`font-bold text-base ${isActive ? 'text-primary' : 'text-on-surface'}`}>{lvl.label}</Text>
                      <Text className="text-on-surface-variant text-[11px] font-bold">{lvl.desc}</Text>
                    </View>
                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isActive ? 'bg-primary border-primary' : 'border-outline-variant/50'}`}>
                      {isActive && <Check color="white" size={12} strokeWidth={4} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Dietary Rhythm Container */}
          <View className="bg-surface-container-low rounded-[40px] p-8 mb-6 border border-white/50">
            <Text className="text-xl font-extrabold text-on-surface tracking-tight mb-6">Dietary Preference</Text>
            <View className="flex-row flex-wrap gap-2">
              {DIETS.map((d) => {
                const isActive = diet === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => setDiet(d.id)}
                    activeOpacity={0.8}
                    className={`px-6 py-3 rounded-full border-2 ${isActive ? 'bg-primary border-primary' : 'bg-surface-container-lowest/50 border-transparent'
                      }`}
                  >
                    <Text className={`font-bold text-sm ${isActive ? 'text-white' : 'text-on-surface'}`}>{d.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sleep Rhythm Container */}
          <View className="bg-surface-container-low rounded-[40px] p-8 mb-6 border border-white/50">
            <Text className="text-xl font-extrabold text-on-surface tracking-tight mb-6">Sleep Quality</Text>
            <View className="flex-row flex-wrap gap-2">
              {SLEEP_LEVELS.map((s) => {
                const isActive = sleep === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setSleep(s.id)}
                    activeOpacity={0.8}
                    className={`px-6 py-3 rounded-full border-2 ${isActive ? 'bg-primary border-primary' : 'bg-surface-container-lowest/50 border-transparent'
                      }`}
                  >
                    <Text className={`font-bold text-sm ${isActive ? 'text-white' : 'text-on-surface'}`}>{s.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Stress Rhythm Container */}
          <View className="bg-surface-container-low rounded-[40px] p-8 border border-white/50">
            <Text className="text-xl font-extrabold text-on-surface tracking-tight mb-6">Stress Level</Text>
            <View className="flex-row flex-wrap gap-2">
              {STRESS_LEVELS.map((st) => {
                const isActive = stress === st.id;
                return (
                  <TouchableOpacity
                    key={st.id}
                    onPress={() => setStress(st.id)}
                    activeOpacity={0.8}
                    className={`px-6 py-3 rounded-full border-2 ${isActive ? 'bg-primary border-primary' : 'bg-surface-container-lowest/50 border-transparent'
                      }`}
                  >
                    <Text className={`font-bold text-sm ${isActive ? 'text-white' : 'text-on-surface'}`}>{st.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Personalized Insight Panel */}
        <View className="bg-surface-container-low p-6 rounded-[32px] border border-white/50 flex-row gap-4 items-start mb-8">
          <View className="p-3 bg-[#dce9ff] rounded-2xl">
            <Sparkles color="#005ac2" size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-bold text-tertiary uppercase tracking-[2px] mb-1">Personalized Insights</Text>
            <Text className="text-sm text-on-surface-variant leading-relaxed font-bold">
              We use these insights to tailor your nutrition and workout plans. Our engine adapts to your hormonal cycle for optimal results.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Action Bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32, backgroundColor: '#f8f9ff', flexDirection: 'row', gap: 16, zIndex: 50 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 py-5 rounded-[24px] bg-[#d3e4fe] items-center justify-center"
        >
          <Text className="text-primary font-bold text-lg">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-[2] rounded-[24px] overflow-hidden shadow-md ${!isComplete ? 'opacity-50' : ''}`}
          onPress={handleNext}
          activeOpacity={0.9}
          disabled={!isComplete || isSubmitting}
        >
          <LinearGradient
            colors={['#006e2f', '#006b5f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full py-5 items-center justify-center flex-row gap-2"
          >
            <Text className="text-white font-extrabold text-lg tracking-tight">
              {isSubmitting ? 'Finalizing...' : 'Calibrate Plan'}
            </Text>
            {!isSubmitting && <ArrowRight color="white" size={20} />}
          </LinearGradient>
        </TouchableOpacity>
      </View >
    </View >
  );
}
