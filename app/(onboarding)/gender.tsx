import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Users } from 'lucide-react-native';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';

export default function GenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

  const handleNext = () => {
    if (selectedGender) {
      router.push({ pathname: '/(onboarding)/profile-details', params: { gender: selectedGender } });
    }
  };

  const Card = ({ type, label, icon: Icon }: { type: 'male' | 'female'; label: string; icon: any }) => {
    const isActive = selectedGender === type;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedGender(type)}
        style={{
          marginBottom: 16, borderRadius: 20, padding: 24,
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: isActive ? 'rgba(110,231,183,0.08)' : 'rgba(255,255,255,0.04)',
          borderWidth: 1,
          borderColor: isActive ? '#6EE7B7' : 'rgba(255,255,255,0.08)',
          shadowColor: isActive ? '#6EE7B7' : 'transparent',
          shadowOffset: { width: 0, height: 8 }, shadowOpacity: isActive ? 0.15 : 0, shadowRadius: 16,
          elevation: isActive ? 6 : 0,
        }}
      >
        <View style={{
          width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16,
          backgroundColor: isActive ? 'rgba(110,231,183,0.15)' : 'rgba(255,255,255,0.06)',
        }}>
          <Icon color={isActive ? '#6EE7B7' : '#64748B'} size={24} />
        </View>
        <Text style={{ color: isActive ? '#F1F5F9' : '#64748B', fontSize: 18, fontWeight: 'bold' }}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#080B14' }}>
      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <ProgressIndicator currentStep={1} totalSteps={5} />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 30, fontWeight: '800', marginBottom: 8 }}>Which biological profile matches you?</Text>
        <Text style={{ color: '#64748B', fontSize: 16, marginBottom: 32 }}>We use this to calibrate your baseline metabolic rate and hormonal markers.</Text>
        <Card type="female" label="Female" icon={User} />
        <Card type="male" label="Male" icon={Users} />
      </View>
      <View style={{ paddingHorizontal: 24, paddingVertical: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }}>
        <TouchableOpacity activeOpacity={0.9} disabled={!selectedGender} onPress={handleNext} style={{ opacity: selectedGender ? 1 : 0.4 }}>
          <LinearGradient colors={['#6EE7B7', '#818CF8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 16, borderRadius: 100, alignItems: 'center' }}>
            <Text style={{ color: '#080B14', fontWeight: '800', fontSize: 17 }}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
