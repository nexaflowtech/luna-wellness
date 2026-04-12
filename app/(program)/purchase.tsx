import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { activateSubscription } from '@/src/services/onboardingService';
import { completeOnboarding } from '@/src/services/userService';

type ProgramId = 'pcos' | 'weight_loss' | 'thyroid';
type Duration = 1 | 3 | 6;

const DURATION_OPTIONS: Array<{ duration: Duration; label: string; price: string }> = [
  { duration: 1, label: '1 Month', price: '₹1,999' },
  { duration: 3, label: '3 Months', price: '₹4,999' },
  { duration: 6, label: '6 Months', price: '₹8,499' },
];

export default function ProgramPurchaseScreen() {
  const params = useLocalSearchParams<{ programId?: string }>();
  const { user, onboardingComplete } = useAuth();
  const [selectedDuration, setSelectedDuration] = useState<Duration>(3);
  const [submitting, setSubmitting] = useState(false);

  const programId = useMemo<ProgramId>(() => {
    const incoming = String(params.programId ?? '').toLowerCase();
    if (incoming === 'weight_loss' || incoming === 'thyroid') return incoming;
    return 'pcos';
  }, [params.programId]);

  const onPurchase = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await activateSubscription(user.uid, { programId, durationMonths: selectedDuration });
      
      // Mark onboarding complete so returning users enter the main app directly
      if (!onboardingComplete) {
        await completeOnboarding(user.uid);
      }

      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
      Alert.alert('Purchase failed', 'Could not activate subscription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text className="text-primary font-headline font-extrabold text-xs tracking-widest uppercase">
          Program Purchase
        </Text>
        <Text className="mt-2 font-headline text-4xl font-extrabold text-on-surface">
          Select Plan Duration
        </Text>
        <Text className="mt-3 text-on-surface-variant text-base">
          Program: {programId.replace('_', ' ').toUpperCase()}
        </Text>

        <View className="mt-8 rounded-3xl bg-surface-container-lowest p-6 border border-outline-variant/30">
          <Text className="font-headline text-lg font-bold text-on-surface">What You Get</Text>
          <Text className="mt-3 text-on-surface-variant">• Benefits: guided workouts, meal plans, habit coaching</Text>
          <Text className="mt-2 text-on-surface-variant">• Duration: choose 1, 3, or 6 months</Text>
          <Text className="mt-2 text-on-surface-variant">• Expected results: improved consistency, measurable progress</Text>
          <Text className="mt-2 text-on-surface-variant">• Reviews: highly rated by Luna members</Text>
        </View>

        <View className="mt-6 gap-3">
          {DURATION_OPTIONS.map((option) => {
            const selected = selectedDuration === option.duration;
            return (
              <TouchableOpacity
                key={option.duration}
                onPress={() => setSelectedDuration(option.duration)}
                className={`rounded-2xl border p-5 ${selected ? 'border-primary bg-primary-fixed/40' : 'border-outline-variant/40 bg-surface-container-low'}`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-headline text-lg font-bold text-on-surface">{option.label}</Text>
                  <Text className="font-headline text-lg font-bold text-primary">{option.price}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-surface via-surface to-transparent">
        <TouchableOpacity activeOpacity={0.9} onPress={onPurchase} disabled={submitting}>
          <LinearGradient colors={['#b7004e', '#e21364']} className="rounded-full py-4 items-center justify-center">
            <Text className="text-on-primary font-headline text-base font-bold">
              {submitting ? 'Activating...' : 'Activate Subscription'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
