import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Header } from '@/src/components/ui/Header';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';
import { SelectionCard } from '@/src/components/onboarding/SelectionCard';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { LunaAiBubble } from '@/src/components/onboarding/LunaAiBubble';

const ALL_GOALS = [
  { id: 'Weight Loss', label: 'Weight Loss', desc: 'Burn fat, build lean muscle', emoji: '🔥', genders: ['male', 'female'] },
  { id: 'PCOS', label: 'Manage PCOS', desc: 'Hormone balance & cycle sync', emoji: '🌸', genders: ['female'] },
  { id: 'Cycle Regulation', label: 'Cycle Regulation', desc: 'Predictable periods & relief', emoji: '🩸', genders: ['female'] },
  { id: 'Thyroid', label: 'Thyroid Health', desc: 'Metabolic support & energy', emoji: '⚡', genders: ['female'] },
  { id: 'Post-pregnancy recovery', label: 'Post-pregnancy recovery', desc: 'Rebuild core & stamina safely', emoji: '👶', genders: ['female'] },
  { id: 'Hormone balance', label: 'Hormone balance', desc: 'Address mood & weight fluctuations', emoji: '⚖️', genders: ['female'] },
  { id: 'Fertility support', label: 'Fertility support', desc: 'Optimize body for conception', emoji: '🌱', genders: ['female'] },
  { id: 'Muscle Gain', label: 'Muscle Gain', desc: 'Build size and strength', emoji: '💪', genders: ['male'] },
  { id: 'Fitness', label: 'Fitness', desc: 'General conditioning & stamina', emoji: '🏃', genders: ['male'] },
];

export default function GoalPhysiqueScreen() {
  const router = useRouter();
  const { user, gender } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  // Fallback to female if missing context for safe fallback
  const userGender = (gender || 'female').toLowerCase();
  
  const filteredGoals = ALL_GOALS.filter(g => g.genders.includes(userGender));

  const handleNext = () => {
    if (!selectedGoal) return;
    // Background write — do NOT await
    if (user?.uid) {
      updateUserDoc(user.uid, {
        goal: selectedGoal,
        onboardingStep: '/(onboarding)/lifestyle',
      }).catch(err => console.error('goal-physique write failed:', err));
    }
    console.log('Selected value:', selectedGoal);
    console.log('Navigating to: /(onboarding)/lifestyle');
    router.push('/(onboarding)/lifestyle');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <Header title="Your Goal" showBack transparent />
            
            <View className="px-6 py-4">
              <ProgressIndicator currentStep={3} totalSteps={4} />
            </View>

            <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.Text entering={FadeInDown.duration(500).springify()} className="text-textPrimary text-[32px] leading-[40px] font-extrabold mb-3">
          What's your primary health goal?
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(100).duration(500)} className="text-textSecondary text-[16px] leading-[24px] mb-8">
          We'll personalize your entire Luna plan around this.
        </Animated.Text>
        
        <View className="gap-2">
          {filteredGoals.map((goal, index) => {
            const isSelected = selectedGoal === goal.id;
            const isRecommended = userGender === 'female' && (goal.id === 'PCOS' || goal.id === 'Cycle Regulation');
            
            return (
              <Animated.View key={goal.id} entering={FadeInDown.delay(150 + index * 50).duration(400)}>
                <SelectionCard
                  title={goal.label}
                  description={goal.desc}
                  icon={<Text className="text-2xl">{goal.emoji}</Text>}
                  isSelected={isSelected}
                  isRecommended={isRecommended}
                  onToggle={() => setSelectedGoal(goal.id)}
                />
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

            {/* Luna AI companion bubble — reacts to selected goal */}
      <LunaAiBubble
        typing={!selectedGoal}
        message={
          !selectedGoal
            ? "Choose the health goal that matters most to you. I'll rebuild your entire plan around it."
            : selectedGoal === 'PCOS'
            ? "Great choice. I'll prioritise insulin sensitivity, androgen balance, and cycle regulation in your plan."
            : selectedGoal === 'Cycle Regulation'
            ? "Understood. I'll align your nutrition and workouts with your menstrual phases for maximum results."
            : selectedGoal === 'Weight Loss'
            ? "Noted. I'll create a sustainable calorie deficit that keeps your hormones and energy levels stable."
            : selectedGoal === 'Muscle Gain'
            ? "Let's go! I'll design a progressive overload protocol with the right macro split for muscle synthesis."
            : selectedGoal === 'Thyroid'
            ? "I'll carefully avoid extreme macros that stress the thyroid and build a metabolic-supportive plan."
            : selectedGoal === 'Fertility support'
            ? "I'll ensure adequate folate, iron, and hormone-supportive nutrition throughout your plan."
            : `I've registered your goal: ${selectedGoal}. Building your personalised protocol now.`
        }
        subMessage={selectedGoal ? "This goal will shape every workout, meal, and insight I provide." : undefined}
      />

      <Animated.View entering={FadeInDown.delay(300).duration(500)} className="absolute bottom-0 left-0 right-0 px-6 py-8 bg-background border-t border-white/5">
              <View className={`${selectedGoal ? 'opacity-100' : 'opacity-40'}`} pointerEvents={selectedGoal ? 'auto' : 'none'}>
                <PrimaryButton title="Continue" onPress={handleNext} />
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
