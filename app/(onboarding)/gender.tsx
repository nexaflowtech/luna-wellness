import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Users } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { SelectionCard } from '@/src/components/onboarding/SelectionCard';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { LunaAiBubble } from '@/src/components/onboarding/LunaAiBubble';

export default function GenderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

  // SYNC handler — navigation must NEVER be blocked by an await.
  // Firestore write fires in background; router.push executes immediately.
  const handleContinue = () => {
    if (!selectedGender) return;

    // Background write — fire and forget
    if (user?.uid) {
      updateUserDoc(user.uid, {
        gender: selectedGender,
        onboardingStep: '/(onboarding)/profile-details',
      }).catch(e => console.log('Gender save error:', e));
    }

    console.log('Selected gender:', selectedGender);
    console.log('Navigating to: /(onboarding)/profile-details');
    router.push('/(onboarding)/profile-details');
  };

  return (
    <ScreenWrapper>
      <View className="px-6 py-4">
        <ProgressIndicator currentStep={1} totalSteps={4} />
      </View>
      
      <View className="flex-1 px-6 pt-6">
        <Animated.Text entering={FadeInDown.duration(500).springify()} className="text-textPrimary text-[32px] leading-[40px] font-extrabold mb-3">
          Which biological profile matches you?
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(100).duration(500)} className="text-textSecondary text-[16px] leading-[24px] mb-10">
          We use this to calibrate your baseline metabolic rate and hormonal markers.
        </Animated.Text>
        
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <SelectionCard 
            title="Female" 
            icon={<User color={selectedGender === 'female' ? '#7C3AED' : '#A1A1AA'} size={26} strokeWidth={2.5} />} 
            isSelected={selectedGender === 'female'}
            onToggle={() => setSelectedGender('female')}
          />
        </Animated.View>
        <View className="h-4" />
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <SelectionCard 
            title="Male" 
            icon={<Users color={selectedGender === 'male' ? '#7C3AED' : '#A1A1AA'} size={26} strokeWidth={2.5} />} 
            isSelected={selectedGender === 'male'}
            onToggle={() => setSelectedGender('male')}
          />
        </Animated.View>
      </View>

      {/* Luna AI companion bubble */}
      <LunaAiBubble
        typing={!selectedGender}
        message={
          selectedGender === 'female'
            ? "Perfect! I'll calibrate your plan around female hormonal cycles, PCOS risk patterns, and metabolic baselines."
            : selectedGender === 'male'
            ? "Great! I'll build your plan around male metabolic markers, testosterone profiles, and recovery patterns."
            : "Hi! I'm Luna 👋 I'll personalize your entire health journey. Start by selecting your biological profile."
        }
        subMessage={selectedGender ? "Tap Continue when you're ready." : undefined}
      />

      <Animated.View entering={FadeInDown.delay(400).duration(500)} className="absolute bottom-0 left-0 right-0 px-6 py-8 bg-background border-t border-white/5">
        <View className={`${selectedGender ? 'opacity-100' : 'opacity-40'}`} pointerEvents={selectedGender ? 'auto' : 'none'}>
          <PrimaryButton title="Continue" onPress={handleContinue} />
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
}
