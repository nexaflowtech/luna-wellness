import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';
import { BmiCharacter } from '@/src/components/onboarding/BmiCharacter';
import { calculateBMI, BodyVariant } from '@/src/utils/getBodyVariant';
import { MetricCard } from '@/src/components/onboarding/MetricCard';
import { Header } from '@/src/components/ui/Header';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { LunaAiBubble } from '@/src/components/onboarding/LunaAiBubble';

const BODY_VARIANTS: { id: BodyVariant; label: string; desc: string }[] = [
  { id: 'slim', label: 'Weight Loss', desc: 'Reduce body fat & lean out' },
  { id: 'athletic', label: 'Muscle Gain', desc: 'Build size and strength' },
  { id: 'normal', label: 'Wellness', desc: 'Maintain and optimize health' },
  { id: 'toned', label: 'Endurance', desc: 'Conditioning and stamina' },
];

const schema = z.object({
  age: z.number().min(16).max(99),
  heightCm: z.number().min(135).max(210),
  weightKg: z.number().min(35).max(150),
  bodyVariant: z.enum(['slim', 'athletic', 'normal', 'toned'] as const),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: 28,
      heightCm: 168,
      weightKg: 60,
      bodyVariant: 'normal',
    },
  });

  const watchHeight = watch('heightCm');
  const watchWeight = watch('weightKg');
  const watchVariant = watch('bodyVariant');

  const bmi = calculateBMI(watchWeight, watchHeight);

  const onSubmit = (data: FormValues) => {
    // Background write — do NOT await; navigation must never be blocked
    if (user?.uid) {
      updateUserDoc(user.uid, {
        age: data.age,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        onboardingStep: '/(onboarding)/goal-physique',
      }).catch(e => console.error('profile-details write failed:', e));
    }
    console.log('Navigating to: /(onboarding)/goal-physique');
    router.push('/(onboarding)/goal-physique');
  };

  let bmiCategory = 'Normal';
  let bmiColor = '#10B981'; // success

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#3B82F6'; // blue
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#F59E0B'; // warning
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#EF4444'; // error
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 pb-24">
              <Header title="Physique & Goals" showBack transparent />

              <View className="px-6 py-4">
                <ProgressIndicator currentStep={2} totalSteps={4} />
              </View>

              <View className="px-6 pt-4">
                {/* Character Preview Panel */}
                <Animated.View entering={FadeInDown.duration(600).springify()} style={{ height: 320 }} className="w-full relative mb-8">
                  <View className="flex-1 rounded-[32px] overflow-hidden border border-white/5 bg-surface relative" style={{
                    shadowColor: bmiColor,
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.15,
                    shadowRadius: 30,
                    elevation: 10
                  }}>
                    <BmiCharacter
                      gender={(params.gender as 'male' | 'female') || 'male'}
                      bmi={bmi}
                    />
                    <View className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                  </View>

                  {/* BMI Live Indicator */}
                  <View className="absolute bottom-6 self-center flex-row justify-center">
                    <View
                      className="px-6 py-3.5 rounded-full flex-row items-center gap-3 bg-surface/90 border border-white/10"
                      style={{ backdropFilter: 'blur(10px)' }}
                    >
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: bmiColor, shadowColor: bmiColor, shadowOpacity: 0.8, shadowRadius: 8 }} />
                      <Text className="text-textPrimary text-[14px] font-bold uppercase tracking-wider">BMI {bmi} • <Text style={{ color: bmiColor }}>{bmiCategory}</Text></Text>
                    </View>
                  </View>
                </Animated.View>

                {/* Metrics Form */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)} className="rounded-[32px] p-6 mb-8 bg-surface border border-white/5 shadow-xl">
                  <View className="flex-row gap-5 mb-5">
                    <Controller
                      control={control}
                      name="age"
                      render={({ field: { value, onChange } }) => (
                        <MetricCard label="Age" value={value} unit="yrs" min={16} max={99} onChange={onChange} />
                      )}
                    />
                  </View>
                  <View className="flex-row gap-5">
                    <Controller
                      control={control}
                      name="heightCm"
                      render={({ field: { value, onChange } }) => (
                        <MetricCard label="Height" value={value} unit="cm" min={135} max={210} onChange={onChange} />
                      )}
                    />
                    <Controller
                      control={control}
                      name="weightKg"
                      render={({ field: { value, onChange } }) => (
                        <MetricCard label="Weight" value={value} unit="kg" min={35} max={150} onChange={onChange} />
                      )}
                    />
                  </View>
                </Animated.View>

                {/* Goal Form */}
                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                  <Text className="text-textSecondary text-[13px] uppercase mb-4 font-bold tracking-widest ml-2">Primary Focus</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 8, paddingHorizontal: 2 }}>
                    <Controller
                      control={control}
                      name="bodyVariant"
                      render={({ field: { value, onChange } }) => (
                        <>
                          {BODY_VARIANTS.map((v) => {
                            const isActive = value === v.id;
                            return (
                              <TouchableOpacity
                                key={v.id}
                                onPress={() => onChange(v.id)}
                                activeOpacity={0.8}
                                className={`w-40 p-5 rounded-[24px] border border-white/5 ${isActive ? 'bg-primary border-primary' : 'bg-surface'}`}
                              >
                                <Text className={`text-[16px] font-extrabold mb-2 ${isActive ? 'text-white' : 'text-textPrimary'}`}>{v.label}</Text>
                                <Text className={`text-[13px] leading-[18px] ${isActive ? 'text-white/80' : 'text-textSecondary'}`}>{v.desc}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </>
                      )}
                    />
                  </ScrollView>
                </Animated.View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Luna AI companion bubble — reacts to live BMI */}
      <LunaAiBubble
        typing
        message={
          bmi < 18.5
            ? `Your BMI is ${bmi} — I'll factor underweight recovery into your plan, prioritising nutrient density.`
            : bmi < 25
              ? `Your BMI is ${bmi} — looking healthy! I'll fine-tune your plan to optimise performance and hormonal balance.`
              : bmi < 30
                ? `Your BMI is ${bmi} — I'll design a sustainable calorie deficit that protects your hormones while you lose weight.`
                : `Your BMI is ${bmi} — I'll create a safe, medically-informed plan that accounts for metabolic adaptation.`
        }
        subMessage="Adjust height & weight above to update your analysis."
      />

      {/* Sticky Bottom Button */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)} className="absolute bottom-0 left-0 right-0 px-6 py-8 bg-background border-t border-white/5">
        <PrimaryButton title="Next Step" onPress={handleSubmit(onSubmit)} />
      </Animated.View>
    </SafeAreaView >
  );
}
