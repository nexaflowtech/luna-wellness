import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { LunaAiBubble } from '@/src/components/onboarding/LunaAiBubble';

export default function AiPlanResult() {
  const router = useRouter();
  const { user } = useAuth();
  const [planData, setPlanData] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      setPlanData(snap.data());
    });
  }, [user]);

  // Route to tabs — navigation ALWAYS fires immediately
  const handleNext = () => {
    if (user?.uid) {
      updateUserDoc(user.uid, { onboardingComplete: true })
        .catch(e => console.error('onboardingComplete write failed:', e));
    }
    console.log('Navigating to: /(tabs)');
    router.replace('/(tabs)');
  };

  const ListItem = ({ title, desc, delay }: { title: string; desc: string; delay: number }) => (
    <Animated.View entering={FadeInDown.delay(delay).duration(500)} className="flex-row mb-5 gap-4 px-2">
      <View className="w-8 h-8 rounded-full bg-accent/10 items-center justify-center mt-1">
        <CheckCircle2 color="#22C55E" size={20} />
      </View>
      <View className="flex-1">
        <Text className="text-[16px] text-textPrimary font-semibold leading-snug">{title}</Text>
        <Text className="text-[14px] text-textSecondary leading-snug mt-1">{desc}</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 60, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInDown.duration(600).springify()} className="items-center mb-12">
          <View className="w-[88px] h-[88px] rounded-full bg-surface border border-accent/20 items-center justify-center mb-6 shadow-2xl shadow-accent/20">
            <Sparkles color="#22C55E" size={40} />
          </View>
          <Text className="text-[36px] font-extrabold text-textPrimary text-center mb-3 leading-[44px]">Your AI Plan is Ready</Text>
          <Text className="text-[16px] text-textSecondary text-center leading-[24px] px-2">
            We've successfully processed your biometric data and crafted a custom path to hit your targets.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <LinearGradient
            colors={['#7C3AED', '#F472B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-[1px] rounded-[32px] mb-8"
          >
            <View className="bg-surface rounded-[31px] p-8">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-[13px] font-bold text-textSecondary uppercase tracking-widest">Plan Breakdown</Text>
                <View className="px-3 py-1 bg-accent/20 rounded-full">
                  <Text className="text-accent font-bold text-[12px]">Score: {planData?.healthScore ?? '--'}</Text>
                </View>
              </View>
              
              <ListItem title="Diet Direction" desc={planData?.aiPlan?.dietStrategy || 'Optimizing nutrition'} delay={300} />
              <ListItem title="Workout Direction" desc={planData?.aiPlan?.workoutStrategy || 'Building stamina'} delay={400} />
              <ListItem title="Focus Areas" desc={(planData?.aiPlan?.hormoneFocusAreas || []).join(', ') || 'Overall wellness'} delay={500} />
            </View>
          </LinearGradient>
        </Animated.View>

      </ScrollView>

      {/* Luna AI companion bubble — final message */}
      <LunaAiBubble
        typing={!planData}
        message={
          !planData 
            ? "Finalising your results..." 
            : `Your plan is ready! I've calculated a health score of ${planData?.healthScore ?? '--'} based on your inputs. Let's get started.`
        }
        subMessage={planData ? "I'll be waiting for you in the dashboard." : undefined}
      />

      <Animated.View entering={FadeIn.delay(800).duration(500)} className="absolute bottom-0 left-0 right-0 px-6 py-8 bg-background border-t border-white/5">
        <View className={`${isSubmitting ? 'opacity-40' : 'opacity-100'}`} pointerEvents={isSubmitting ? 'none' : 'auto'}>
          <PrimaryButton 
            title="Go to Dashboard" 
            onPress={handleNext} 
          />
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
}
