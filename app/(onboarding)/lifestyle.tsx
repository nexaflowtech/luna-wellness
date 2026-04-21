import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
// Reanimated removed — plain View used instead
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { Header } from '@/src/components/ui/Header';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { LunaAiBubble } from '@/src/components/onboarding/LunaAiBubble';

const ACTIVITY_OPTIONS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
  { id: 'light', label: 'Light', desc: '1-3 days/week' },
  { id: 'moderate', label: 'Moderate', desc: '3-5 days/week' },
  { id: 'active', label: 'Active', desc: 'Daily exercise or physical job' },
];

const DIET_OPTIONS = [
  { id: 'anything', label: 'Anything', desc: 'No restrictions' },
  { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat' },
  { id: 'vegan', label: 'Vegan', desc: 'Plant-based only' },
  { id: 'keto', label: 'Keto / Low-Carb', desc: 'High fat, low carb' },
];

const SLEEP_OPTIONS = [
  { id: 'poor', label: '< 5 hrs', desc: 'Poor / Insomnia' },
  { id: 'fair', label: '5-6 hrs', desc: 'Fair sleep' },
  { id: 'good', label: '7-8 hrs', desc: 'Good / Healthy' },
  { id: 'excel', label: '> 8 hrs', desc: 'Excellent' },
];

const STRESS_OPTIONS = [
  { id: 'low', label: 'Low', desc: 'Usually relaxed' },
  { id: 'moderate', label: 'Moderate', desc: 'Manageable daily stress' },
  { id: 'high', label: 'High', desc: 'Frequent anxiety/chaos' },
  { id: 'severe', label: 'Severe', desc: 'Overwhelming' },
];

export default function LifestyleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activity, setActivity] = useState('');
  const [diet, setDiet] = useState('');
  const [sleep, setSleep] = useState('');
  const [stress, setStress] = useState('');
  const isComplete = activity && diet && sleep && stress;

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (!isComplete) return;
    // Background write — do NOT await
    if (user?.uid) {
      updateUserDoc(user.uid, {
        activityLevel: activity,
        foodPreference: diet,
        sleep,
        stress,
        onboardingStep: '/(onboarding)/ai-plan-generating',
      }).catch(e => console.error('lifestyle write failed:', e));
    }
    console.log('Selected value: activity=', activity, 'diet=', diet, 'sleep=', sleep, 'stress=', stress);
    console.log('Navigating to: /(onboarding)/ai-plan-generating');
    router.push('/(onboarding)/ai-plan-generating');
  };

  const renderSelector = (options: any[], selectedValue: string, onSelect: (val: string) => void) => (
    <View className="flex-row flex-wrap justify-between gap-y-4">
      {options.map((opt) => {
        const isActive = selectedValue === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            activeOpacity={0.8}
            className={`w-[48%] rounded-[24px] p-5 border border-white/5 shadow-lg ${isActive ? 'bg-primary border-primary' : 'bg-background-card'}`}
          >
            <Text className={`text-[16px] font-extrabold mb-1.5 ${isActive ? 'text-white' : 'text-text-primary'}`}>{opt.label}</Text>
            <Text className={`text-[13px] leading-[18px] ${isActive ? 'text-white/80' : 'text-text-secondary'}`}>{opt.desc}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <Header title="Lifestyle Basics" showBack transparent />

            <View className="px-6 py-4">
              <ProgressIndicator currentStep={4} totalSteps={4} />
            </View>

            <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 140, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
              <Text className="text-text-primary text-[32px] leading-[40px] font-extrabold mb-3">
                Daily Habits
              </Text>
              <Text className="text-text-secondary text-[16px] leading-[24px] mb-8">
                We use this data to accurately calculate your metabolic maintenance load.
              </Text>

              <View>
                <Text className="text-text-secondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-2">Activity Level</Text>
                {renderSelector(ACTIVITY_OPTIONS, activity, setActivity)}
              </View>

              <View className="h-10" />

              <View>
                <Text className="text-text-secondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-2">Dietary Preference</Text>
                {renderSelector(DIET_OPTIONS, diet, setDiet)}
              </View>

              <View className="h-10" />

              <View>
                <Text className="text-text-secondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-2">Average Sleep</Text>
                {renderSelector(SLEEP_OPTIONS, sleep, setSleep)}
              </View>

              <View className="h-10" />

              <View>
                <Text className="text-text-secondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-2">Daily Stress Level</Text>
                {renderSelector(STRESS_OPTIONS, stress, setStress)}
              </View>
            </ScrollView>

            {/* Luna AI companion bubble — reacts to lifestyle selections */}
            <LunaAiBubble
              typing={!isComplete}
              message={
                !isComplete
                  ? "I need your activity and lifestyle data to calculate your personalised metabolic rate."
                  : stress === 'high' || stress === 'severe'
                    ? "High stress signals detected — I'll add cortisol-lowering protocols and adapt your recovery windows."
                    : sleep === 'poor'
                      ? "Poor sleep affects hormone production significantly. I'll factor sleep recovery into your plan structure."
                      : activity === 'sedentary'
                        ? "Starting from sedentary — I'll build a progressive activity ramp so your body adapts safely."
                        : "Great lifestyle snapshot! I have everything I need to generate your personalised health blueprint."
              }
              subMessage={isComplete ? "Tap Generate Plan to have me build your protocol." : undefined}
            />

            <View className="absolute bottom-0 left-0 right-0 px-6 py-8 bg-background border-t border-white/5">
              <View className={`${isComplete ? 'opacity-100' : 'opacity-40'}`} pointerEvents={isComplete ? 'auto' : 'none'}>
                <PrimaryButton title="Generate Plan" onPress={handleNext} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
