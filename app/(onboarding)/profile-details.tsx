import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react-native';

import { BmiCharacter } from '@/src/components/onboarding/BmiCharacter';
import { calculateBMI } from '@/src/utils/getBodyVariant';
import { MetricCard } from '@/src/components/onboarding/MetricCard';
import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { useOnboardingStore } from '@/src/store/onboardingStore';

const { width } = Dimensions.get('window');

const schema = z.object({
  heightCm: z.number().min(135).max(250),
  weightKg: z.number().min(30).max(200),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const { user, gender } = useAuth();
  const { height, weight, setBodyMetrics } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      heightCm: height || 175,
      weightKg: weight || 72,
    },
  });

  const watchHeight = watch('heightCm');
  const watchWeight = watch('weightKg');

  const bmi = calculateBMI(watchWeight, watchHeight);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // Extrapolate BMI Category for DB save
    let localBmiCategory = 'Normal';
    if (bmi < 18.5) localBmiCategory = 'Underweight';
    else if (bmi >= 25 && bmi < 30) localBmiCategory = 'Overweight';
    else if (bmi >= 30) localBmiCategory = 'Obese';

    if (user?.uid) {
      updateUserDoc(user.uid, {
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        bmi: Number(bmi),
        bmi_category: localBmiCategory,
        onboardingStep: '/(onboarding)/goal-physique',
      }).catch(e => console.error('profile-details write failed:', e));
    }

    setBodyMetrics(data.heightCm, data.weightKg, Number(bmi));

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/(onboarding)/goal-physique');
    }, 400);
  };

  let bmiCategory = 'Healthy';
  let bmiColor = '#006e2f'; // primary
  let bmiDesc = "Maintaining this weight reduces the risk of chronic conditions.";

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#005ac2'; // tertiary
    bmiDesc = "Your BMI is in the underweight range. We will focus on nutrient density for healthy mass gain.";
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#ba1a1a'; // error
    bmiDesc = "Your BMI is in the overweight range. Our AI will focus on a sustainable, metabolic approach.";
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#ba1a1a';
    bmiDesc = "Your BMI is in the overweight range. Our AI will focus on a sustainable, metabolic approach.";
  }

  return (
    <View className="flex-1 bg-surface-bright">
      {/* Transactional Progress Header */}
      <View className="w-full px-8 pt-16 pb-6 flex-row items-center gap-2 bg-surface-bright">
        <View className="h-1 flex-1 bg-primary rounded-full" />
        <View className="h-1 flex-1 bg-primary rounded-full" />
        <View className="h-1 flex-1 bg-surface-container-highest rounded-full" />
        <View className="h-1 flex-1 bg-surface-container-highest rounded-full" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header Section */}
        <View className="mb-10 mt-4">
          <Text className="text-[40px] font-extrabold text-on-surface tracking-tighter leading-[48px]">
            Let's calculate your
          </Text>
          <Text className="text-[40px] font-extrabold text-primary tracking-tighter leading-[48px] opacity-80">
            Body Vitality.
          </Text>
          <Text className="text-on-surface-variant text-lg leading-relaxed font-medium mt-4">
            We use your BMI to tailor nutrition and activity goals specifically for your body type.
          </Text>
        </View>

        {/* BMI Index Bento Box */}
        <View className="bg-surface-container-low rounded-[40px] p-8 flex-col items-center justify-center border border-white/50 mb-8 overflow-hidden">
          {/* Character Viewport */}
          <View className="w-48 h-64 mx-auto relative justify-center items-center mb-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-inner border border-black/5">
            <BmiCharacter gender={gender === 'male' ? 'male' : 'female'} bmi={bmi} />
          </View>

          <View className="items-center">
            <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[2px] mb-1">Your BMI Index</Text>
            <Text className="text-[64px] font-extrabold text-on-surface tracking-tighter leading-none">{bmi}</Text>

            {/* Glow Chip Status */}
            <View
              className="flex-row items-center gap-2 px-6 py-2 rounded-full mt-6"
              style={{ backgroundColor: `${bmiColor}1A` }}
            >
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: bmiColor }} />
              <Text className="font-bold text-sm tracking-wide" style={{ color: bmiColor }}>{bmiCategory}</Text>
            </View>
          </View>
        </View>

        {/* Input Metrics Grid */}
        <View className="flex-col gap-4 mb-8">
          <Controller
            control={control}
            name="heightCm"
            render={({ field: { value, onChange } }) => (
              <MetricCard label="Height" value={value} unit="cm" min={135} max={250} onChange={onChange} />
            )}
          />
          <Controller
            control={control}
            name="weightKg"
            render={({ field: { value, onChange } }) => (
              <MetricCard label="Weight" value={value} unit="kg" min={30} max={200} onChange={onChange} />
            )}
          />
        </View>

        {/* AI Health Insight Note */}
        <View className="bg-[#eef4ff] p-6 rounded-[32px] border border-tertiary-container/20 flex-row gap-4 items-start mb-8">
          <View className="p-3 bg-[#dce9ff] rounded-2xl">
            <Sparkles color="#005ac2" size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-bold text-tertiary uppercase tracking-[2px] mb-1">Health Insight</Text>
            <Text className="text-sm text-on-surface-variant leading-relaxed font-bold">
              {bmiDesc}
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
          className="flex-[2] rounded-[24px] overflow-hidden shadow-md"
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.9}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={['#006e2f', '#006b5f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full py-5 items-center justify-center flex-row gap-2"
          >
            <Text className="text-white font-extrabold text-lg tracking-tight">
              {isSubmitting ? 'Calibrating...' : 'See Results'}
            </Text>
            {!isSubmitting && <ArrowRight color="white" size={20} />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
