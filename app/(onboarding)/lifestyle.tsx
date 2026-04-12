import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';

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

export default function LifestyleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activity, setActivity] = useState('');
  const [diet, setDiet] = useState('');
  const isComplete = activity && diet;

  const handleNext = () => {
    if (!isComplete) return;
    router.push({ pathname: '/(onboarding)/ai-loading', params: { ...params, diet, habits: activity } });
  };

  const renderSelector = (options: any[], selectedValue: string, onSelect: (val: string) => void) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
      {options.map((opt) => {
        const isActive = selectedValue === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            activeOpacity={0.8}
            style={{
              borderRadius: 20, padding: 16, width: '48%',
              backgroundColor: isActive ? 'rgba(129,140,248,0.1)' : 'rgba(255,255,255,0.04)',
              borderWidth: 1,
              borderColor: isActive ? '#818CF8' : 'rgba(255,255,255,0.08)',
              shadowColor: isActive ? '#818CF8' : 'transparent',
              shadowOffset: { width: 0, height: 6 }, shadowOpacity: isActive ? 0.15 : 0, shadowRadius: 12,
              elevation: isActive ? 4 : 0,
            }}
          >
            <Text style={{ color: isActive ? '#F1F5F9' : '#64748B', fontSize: 15, fontWeight: 'bold', marginBottom: 4 }}>{opt.label}</Text>
            <Text style={{ color: '#334155', fontSize: 12 }}>{opt.desc}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#080B14' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, marginBottom: 8 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <Text style={{ color: '#F1F5F9', fontSize: 20 }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#F1F5F9', fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, marginLeft: -40 }}>Lifestyle Basics</Text>
      </View>

      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <ProgressIndicator currentStep={4} totalSteps={5} />
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 26, fontWeight: '800', marginBottom: 8 }}>Daily Habits</Text>
        <Text style={{ color: '#64748B', fontSize: 15, marginBottom: 32 }}>We use this data to accurately calculate your metabolic maintenance load.</Text>
        <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: 'bold', marginBottom: 16 }}>Activity Level</Text>
        {renderSelector(ACTIVITY_OPTIONS, activity, setActivity)}
        <View style={{ height: 28 }} />
        <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: 'bold', marginBottom: 16 }}>Dietary Preference</Text>
        {renderSelector(DIET_OPTIONS, diet, setDiet)}
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, backgroundColor: '#080B14', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }}>
        <TouchableOpacity activeOpacity={0.9} disabled={!isComplete} onPress={handleNext} style={{ opacity: isComplete ? 1 : 0.4 }}>
          <LinearGradient colors={['#6EE7B7', '#818CF8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 16, borderRadius: 100, alignItems: 'center' }}>
            <Text style={{ color: '#080B14', fontWeight: '800', fontSize: 17 }}>Generate Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
