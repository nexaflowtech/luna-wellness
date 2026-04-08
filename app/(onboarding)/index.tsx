import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Moon } from 'lucide-react-native';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface items-center justify-between py-20 px-8 relative overflow-hidden">
      {/* Abstract Background Textures */}
      <View className="absolute inset-0 z-0 pointer-events-none">
        <View className="absolute -top-10 -left-10 w-[60%] h-[60%] bg-primary-fixed/20 rounded-full blur-3xl opacity-50" />
        <View className="absolute -bottom-10 -right-10 w-[50%] h-[50%] bg-secondary-container/10 rounded-full blur-3xl opacity-50" />
      </View>

      {/* Top Branding Accent */}
      <View className="z-10 items-center">
        <Text className="font-label text-xs uppercase tracking-widest text-primary/60 font-semibold">
          Editorial Wellness
        </Text>
      </View>

      {/* Central Identity Cluster */}
      <View className="z-10 items-center gap-8">
        <View className="relative items-center justify-center">
          <View className="absolute w-40 h-40 bg-primary/20 rounded-full blur-xl" />
          <View className="w-32 h-32 items-center justify-center bg-surface-container-lowest rounded-full shadow-xl overflow-hidden border-2 border-primary-fixed/30">
             <Moon size={48} color="#b7004e" strokeWidth={1.5} />
          </View>
        </View>
        
        <View className="items-center mt-6">
          <Text className="font-headline text-5xl font-black text-on-surface italic">
            Luna
          </Text>
          <Text className="font-headline text-lg font-medium text-on-surface-variant/80 mt-2">
            Living Sanctuary
          </Text>
        </View>
      </View>

      {/* Footer Action Section */}
      <View className="z-10 w-full max-w-md items-center gap-10 mt-8">
        <Text className="text-on-surface-variant text-base text-center font-medium px-4">
          A personalized space designed for your hormonal harmony and restorative health.
        </Text>

        <View className="w-full gap-5">
          <PrimaryButton 
            title="Start Your Journey" 
            onPress={() => router.push('/(onboarding)/step1')} 
            showArrow={true} 
          />
          <TouchableOpacity onPress={() => router.push('/(onboarding)/login')} className="self-center">
            <Text className="text-on-surface-variant font-label text-sm font-semibold tracking-wider uppercase mt-4">
              I have an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Version Tag */}
      <View className="absolute bottom-8 z-10 flex-row items-center gap-2">
        <View className="h-[1px] w-4 bg-outline-variant" />
        <Text className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
          Version 2.4.0
        </Text>
        <View className="h-[1px] w-4 bg-outline-variant" />
      </View>
    </View>
  );
}
