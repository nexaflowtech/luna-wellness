import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useUser } from '@/src/context/UserContext';

type ProgramId = 'pcos' | 'weight_loss' | 'thyroid';

const PROGRAMS: Array<{
  id: ProgramId;
  title: string;
  subtitle: string;
  benefits: string[];
  expectedResults: string;
  reviews: string;
}> = [
  {
    id: 'pcos',
    title: 'PCOS Program',
    subtitle: 'Hormone-stabilizing movement and nutrition',
    benefits: ['Cycle support', 'Insulin sensitivity', 'Energy stabilization'],
    expectedResults: 'Expected results in 6-8 weeks',
    reviews: '4.9/5 from 3,200 members',
  },
  {
    id: 'weight_loss',
    title: 'Weight Loss Program',
    subtitle: 'Sustainable fat-loss with metabolic support',
    benefits: ['Fat reduction', 'Strength retention', 'Habit consistency'],
    expectedResults: 'Expected results in 4-6 weeks',
    reviews: '4.8/5 from 5,100 members',
  },
  {
    id: 'thyroid',
    title: 'Thyroid Program',
    subtitle: 'Thyroid-friendly meals and low-stress workouts',
    benefits: ['Stress regulation', 'Energy balance', 'Recovery focus'],
    expectedResults: 'Expected results in 8-10 weeks',
    reviews: '4.8/5 from 2,600 members',
  },
];

export default function ProgramRecommendationScreen() {
  const { profile } = useUser();
  const [selected, setSelected] = useState<ProgramId>('pcos');

  const autoRecommended = useMemo(() => {
    const fromProfile = String(profile?.recommendedProgram ?? '').toLowerCase() as ProgramId;
    return PROGRAMS.some((p) => p.id === fromProfile) ? fromProfile : 'pcos';
  }, [profile?.recommendedProgram]);

  React.useEffect(() => {
    setSelected(autoRecommended);
  }, [autoRecommended]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text className="text-primary font-headline font-extrabold text-xs tracking-widest uppercase">
          Program Recommendation
        </Text>
        <Text className="mt-2 font-headline text-4xl font-extrabold text-on-surface">
          Your Best Match
        </Text>
        <Text className="mt-3 text-on-surface-variant text-base">
          Choose your program to continue to subscription and activation.
        </Text>

        <View className="mt-8 gap-4">
          {PROGRAMS.map((program) => {
            const isSelected = selected === program.id;
            return (
              <TouchableOpacity
                key={program.id}
                activeOpacity={0.9}
                onPress={() => setSelected(program.id)}
                className={`rounded-3xl border p-5 ${isSelected ? 'border-primary bg-primary-fixed/40' : 'border-outline-variant/40 bg-surface-container-lowest'}`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-headline text-xl font-bold text-on-surface">{program.title}</Text>
                  {isSelected && (
                    <View className="rounded-full bg-primary px-3 py-1">
                      <Text className="text-on-primary text-xs font-bold uppercase tracking-wider">Selected</Text>
                    </View>
                  )}
                </View>
                <Text className="mt-1 text-on-surface-variant">{program.subtitle}</Text>
                <Text className="mt-4 text-on-surface text-sm font-semibold uppercase tracking-widest">Benefits</Text>
                <View className="mt-2 gap-1">
                  {program.benefits.map((benefit) => (
                    <Text key={benefit} className="text-on-surface-variant">• {benefit}</Text>
                  ))}
                </View>
                <Text className="mt-4 text-primary font-semibold">{program.expectedResults}</Text>
                <Text className="mt-1 text-on-surface-variant">{program.reviews}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-surface via-surface to-transparent">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/(program)/pricing', params: { programId: selected } })}
        >
          <LinearGradient colors={['#b7004e', '#e21364']} className="rounded-full py-4 items-center justify-center">
            <Text className="text-on-primary font-headline text-base font-bold">Continue To Pricing</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
