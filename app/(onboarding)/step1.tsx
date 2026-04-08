import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Leaf } from 'lucide-react-native';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { GlassCard } from '@/src/components/onboarding/GlassCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* Header - Skip */}
      <View className="w-full flex-row justify-end px-8 pt-4">
        <TouchableOpacity onPress={() => router.push('/(onboarding)/login')}>
          <Text className="text-primary font-headline font-bold text-sm tracking-wide">
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 relative overflow-hidden px-6 pt-8">
        {/* Background Artistic Elements */}
        <View className="absolute -top-10 -right-10 w-72 h-72 bg-primary-fixed/30 blur-3xl rounded-full opacity-60 z-0" />
        <View className="absolute bottom-20 -left-5 w-60 h-60 bg-secondary-container/20 blur-3xl rounded-full opacity-60 z-0" />

        {/* Visual Content Section */}
        <View className="flex-1 justify-center z-10">
          <View className="relative w-full aspect-[4/5] max-w-sm mx-auto">
            {/* Main Image */}
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC497eSksgB3ru_p6LBJNvLgRaSSE7-zPYC6tAohVUFAkEnfphPql3sFmP2l27rCS5U8I_jJ8SIC_v6-k_VprWzRDRxAkquFVY3ApolVB8l9LuD-GFqnwGPmwSM6geYL775mk2cULdEGi96AHaE7fWsWYzIUkWOOKnxnhD7PHE9CWoR5L3Y7A4LQ2UV0VeZJmxVrQCOCOnhskAH3REbTEzgcY5T0mc66ZNmgMnPVHISGstMKeWexzcE1KnNRG9G1lwVrAr2NK-0bzU' }}
              className="w-full h-full rounded-2xl"
              resizeMode="cover"
            />

            {/* Floating Editorial Badge */}
            <GlassCard className="absolute -bottom-6 -right-4 flex-row items-center gap-4 max-w-[220px]">
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-lg">
                <Leaf color="#ffffff" size={24} />
              </View>
              <View>
                <Text className="font-headline font-bold text-xs text-on-surface">Holistic Insights</Text>
                <Text className="text-[10px] font-medium text-on-surface/60 mt-1">Daily Guidance</Text>
              </View>
            </GlassCard>
          </View>

          {/* Text Area */}
          <View className="mt-16 items-center max-w-md mx-auto">
            <View className="flex-row items-center justify-center gap-2 mb-4">
              <View className="w-8 h-[2px] bg-primary-container/30" />
              <Text className="font-headline font-black italic text-primary tracking-tighter text-lg">
                Luna Wellness
              </Text>
              <View className="w-8 h-[2px] bg-primary-container/30" />
            </View>

            <Text className="font-headline font-extrabold text-4xl text-on-surface tracking-tight text-center leading-tight mb-4">
              Your Personal AI Coach for <Text className="text-primary italic">Hormonal Health.</Text>
            </Text>

            <Text className="text-on-surface-variant text-base leading-relaxed text-center px-4 mb-10">
              Understand your cycle, optimize your vitality, and find balance with editorial-grade wellness intelligence.
            </Text>
          </View>
        </View>

        {/* Footer Controls */}
        <View className="pb-8 pt-8 items-center gap-8 z-10">
          {/* Step Indicators */}


          <PrimaryButton
            title="Next"
            onPress={() => router.push('/(onboarding)/login')}
            showArrow={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
