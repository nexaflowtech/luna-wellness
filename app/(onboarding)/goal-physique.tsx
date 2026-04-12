import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';
import { BodyPreview3D } from '@/src/components/onboarding/BodyPreview3D';
import { BodyVariant } from '@/src/utils/getBodyVariant';

const BODY_VARIANTS: { id: BodyVariant; label: string; desc: string }[] = [
  { id: 'slim', label: 'Weight Loss', desc: 'Reduce body fat & lean out' },
  { id: 'athletic', label: 'Muscle Gain', desc: 'Build size and strength' },
  { id: 'normal', label: 'Wellness', desc: 'Maintain and optimize health' },
  { id: 'toned', label: 'Endurance', desc: 'Conditioning and stamina' },
];

export default function GoalPhysiqueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedVariant, setSelectedVariant] = useState<BodyVariant>(BODY_VARIANTS[0].id);

  const handleNext = () => {
    router.push({ pathname: '/(onboarding)/lifestyle', params: { ...params, bodyVariant: selectedVariant } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#080B14' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, marginBottom: 8 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <Text style={{ color: '#F1F5F9', fontSize: 20 }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#F1F5F9', fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, marginLeft: -40 }}>Goal Physique</Text>
      </View>

      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <ProgressIndicator currentStep={3} totalSteps={5} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#F1F5F9', fontSize: 26, fontWeight: '800', marginBottom: 8, textAlign: 'center' }}>Select your goal.</Text>
          <Text style={{ color: '#64748B', fontSize: 14, textAlign: 'center' }}>Choose the direction you want your body composition to evolve towards.</Text>
        </View>

        <View style={{ height: '38%', width: '100%', marginBottom: 20, borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(110,231,183,0.1)' }}>
          <BodyPreview3D bodyVariant={selectedVariant} />
        </View>

        <Text style={{ color: '#64748B', fontSize: 11, textTransform: 'uppercase', marginBottom: 12, fontWeight: '700', letterSpacing: 1.5 }}>Body Direction</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 8 }}>
          {BODY_VARIANTS.map((v) => {
            const isActive = selectedVariant === v.id;
            return (
              <TouchableOpacity
                key={v.id}
                onPress={() => setSelectedVariant(v.id)}
                activeOpacity={0.8}
                style={{
                  width: 144, padding: 18, borderRadius: 20,
                  backgroundColor: isActive ? 'rgba(110,231,183,0.08)' : 'rgba(255,255,255,0.04)',
                  borderWidth: 1,
                  borderColor: isActive ? '#6EE7B7' : 'rgba(255,255,255,0.08)',
                  shadowColor: isActive ? '#6EE7B7' : 'transparent',
                  shadowOffset: { width: 0, height: 8 }, shadowOpacity: isActive ? 0.15 : 0, shadowRadius: 16,
                  elevation: isActive ? 6 : 0,
                }}
              >
                <Text style={{ color: isActive ? '#6EE7B7' : '#F1F5F9', fontSize: 15, fontWeight: 'bold', marginBottom: 6 }}>{v.label}</Text>
                <Text style={{ color: '#64748B', fontSize: 12 }}>{v.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 24, paddingVertical: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleNext}>
          <LinearGradient colors={['#6EE7B7', '#818CF8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 16, borderRadius: 100, alignItems: 'center' }}>
            <Text style={{ color: '#080B14', fontWeight: '800', fontSize: 17 }}>Next Step</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
