import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';
import { BodyPreview3D } from '@/src/components/onboarding/BodyPreview3D';
import { calculateBMI } from '@/src/utils/getBodyVariant';
import { MetricCard } from '@/src/components/onboarding/MetricCard';

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [weightKg, setWeightKg] = useState(60);
  const [heightCm, setHeightCm] = useState(168);

  const bmi = calculateBMI(weightKg, heightCm);

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/goal-physique',
      params: {
        ...params,
        weightKg: weightKg.toString(),
        heightCm: heightCm.toString(),
        bmi: bmi.toString(),
      }
    });
  };

  // BMI Category for Display
  let bmiCategory = 'Normal';
  let bmiColor = '#10B981'; // Success

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#818CF8'; // Soft indigo
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#FCA5A5'; // Soft coral
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#EF4444'; // Danger red
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#080B14' }}>
      <View className="w-full flex-row items-center px-6 pt-4 mb-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
           <Text style={{ color: '#F8FAFC', fontSize: 20 }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, marginLeft: -40 }}>Current Physique</Text>
      </View>

      <View className="px-6 py-4">
        <ProgressIndicator currentStep={2} totalSteps={5} />
      </View>

      <View className="flex-1 px-6">
        {/* Dynamic 3D Body Preview in top 40% panel */}
        <View style={{ height: '45%' }} className="w-full relative mb-6">
           <View style={{ flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(110,231,183,0.1)' }}>
             <BodyPreview3D bmi={bmi} />
           </View>
           
           {/* BMI Live Indicator Chip */}
           <View className="absolute bottom-4 self-center flex-row justify-center mt-4">
             <View 
               className="px-5 py-3 rounded-full flex-row items-center gap-3"
               style={{
                 backgroundColor: 'rgba(10,10,15,0.8)',
                 borderWidth: 1,
                 borderColor: 'rgba(255,255,255,0.1)',
                 shadowColor: bmiColor,
                 shadowOffset: { width: 0, height: 6 },
                 shadowOpacity: 0.4,
                 shadowRadius: 16,
                 elevation: 8
               }}
             >
               <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: bmiColor, shadowColor: bmiColor, shadowOpacity: 0.8, shadowRadius: 8 }} />
               <Text style={{ color: '#F8FAFC', fontSize: 13, fontWeight: '600' }}>BMI {bmi} • {bmiCategory}</Text>
             </View>
           </View>
        </View>

        {/* Glassmorphism Card Wrapping Inputs */}
        <View className="rounded-[24px] p-6 mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
          <View className="flex-row gap-4">
             {/* If MetricCard doesn't support dark theme, it needs to be updated too, but we pass props if needed */}
            <MetricCard label="Height" value={heightCm} unit="cm" min={135} max={210} onChange={setHeightCm} />
            <MetricCard label="Weight" value={weightKg} unit="kg" min={35} max={150} onChange={setWeightKg} />
          </View>
        </View>
      </View>

      <View className="px-6 py-6 border-t border-[rgba(255,255,255,0.1)]">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleNext}
        >
          <LinearGradient 
            colors={['#7C3AED', '#00D4FF']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            className="py-4 rounded-full flex-row items-center justify-center"
          >
            <Text className="text-white font-bold text-lg">Set Body Goal</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
