import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  FadeInDown
} from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { useAuth } from '@/src/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { updateUserDoc } from '@/src/services/authService';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LOADING_TEXTS = [
  "Structuring workout protocols...",
  "Calibrating active recovery...",
  "Integrating rest cycles...",
  "Finalizing your Luna blueprint..."
];

export default function AiPlanGenerating() {
  const router = useRouter();
  const { user } = useAuth();
  const [textIndex, setTextIndex] = useState(0);
  
  const mainProgress = useSharedValue(0);
  
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);
  
  const corePulse = useSharedValue(1);

  useEffect(() => {
    mainProgress.value = withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) });

    ring1.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);
    ring2.value = withDelay(600, withRepeat(withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false));
    ring3.value = withDelay(1200, withRepeat(withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false));
    
    corePulse.value = withRepeat(withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
    ), -1, true);

    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 900);

    let isMounted = true;

    const computeAndSavePlan = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const data = snap.data();
        if (!data) return;

        const weight = data.weightKg || 60;
        const heightM = (data.heightCm || 168) / 100;
        const bmi = weight / (heightM * heightM);

        // BMI Score (40%)
        let bmiMultiplier = 1.0;
        if (bmi > 30 || bmi < 18.5) bmiMultiplier = 0.4;
        else if (bmi > 24.9) bmiMultiplier = 0.7;

        // Activity Score (20%)
        let actMultiplier = 0.5;
        if (data.activityLevel === 'active') actMultiplier = 1.0;
        else if (data.activityLevel === 'moderate') actMultiplier = 0.8;
        else if (data.activityLevel === 'sedentary') actMultiplier = 0.3;

        // Sleep Score (20%)
        let sleepMultiplier = 0.6;
        if (data.sleep === 'excel') sleepMultiplier = 1.0;
        else if (data.sleep === 'good') sleepMultiplier = 0.9;
        else if (data.sleep === 'poor') sleepMultiplier = 0.3;

        // Stress Score (20%)
        let stressMultiplier = 0.6;
        if (data.stress === 'low') stressMultiplier = 1.0;
        else if (data.stress === 'moderate') stressMultiplier = 0.8;
        else if (data.stress === 'severe') stressMultiplier = 0.2;

        const score = Math.round((bmiMultiplier * 40) + (actMultiplier * 20) + (sleepMultiplier * 20) + (stressMultiplier * 20));

        const aiPlan = {
          dietStrategy: `Tailored macros for ${data.goal ?? 'your goal'}`,
          workoutStrategy: `Progressive routine scaled for ${data.activityLevel ?? 'your lifestyle'}`,
          hormoneFocusAreas: ['Cortisol Reset', 'Metabolic Boost']
        };

        await updateUserDoc(user.uid, { aiPlan, healthScore: score });
      } catch (err) {
        console.error("AI Generation Error: ", err);
      }
    };

    const task = computeAndSavePlan();

    // Use Promise.race: navigate after plan completes OR after 5s max,
    // whichever comes first. Navigation always fires.
    const maxWait = new Promise<void>(resolve => setTimeout(resolve, 5000));

    Promise.race([task, maxWait]).then(() => {
      if (isMounted) {
        console.log('Navigating to: /(onboarding)/ai-plan-result');
        router.replace('/(onboarding)/ai-plan-result');
      }
    });

    // Fallback: hard timeout at 3.8s for animation continuity
    const timeout = setTimeout(() => {
      if (isMounted) {
        console.log('Timeout fallback navigating to: /(onboarding)/ai-plan-result');
        router.replace('/(onboarding)/ai-plan-result');
      }
    }, 3800);

    return () => {
      isMounted = false;
      clearInterval(textInterval);
      clearTimeout(timeout);
    };
  }, []);

  const getRingStyle = (sv: Animated.SharedValue<number>) => useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(sv.value, [0, 1], [0.8, 3.8]) }],
      opacity: interpolate(sv.value, [0, 0.5, 1], [0.8, 0.3, 0]),
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: '#7C3AED',
      backgroundColor: 'rgba(124, 58, 237, 0.05)',
    };
  });

  const coreStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: corePulse.value }],
      shadowOpacity: interpolate(corePulse.value, [1, 1.2], [0.6, 1]),
      shadowRadius: interpolate(corePulse.value, [1, 1.2], [15, 30]),
      shadowColor: '#F472B6',
      elevation: 15,
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    const strokeDashoffset = interpolate(
      mainProgress.value,
      [0, 1],
      [377, 0], // Context changed for r="60"
      Extrapolate.CLAMP
    );
    return {
      strokeDashoffset,
    };
  });

  return (
    <ScreenWrapper className="items-center justify-center bg-background">
      <View className="items-center justify-center w-full">
        <View className="w-[240px] h-[240px] items-center justify-center mb-20 relative">
          <Animated.View style={getRingStyle(ring3)} />
          <Animated.View style={getRingStyle(ring2)} />
          <Animated.View style={getRingStyle(ring1)} />
          
          <Animated.View className="w-[70px] h-[70px] rounded-full z-10" style={coreStyle}>
            <LinearGradient
              colors={['#7C3AED', '#F472B6']}
              className="w-full h-full rounded-full"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          
          <Svg width="180" height="180" viewBox="0 0 180 180" className="absolute z-20">
             <Circle
               cx="90"
               cy="90"
               r="60"
               stroke="rgba(255, 255, 255, 0.05)"
               strokeWidth="5"
               fill="none"
             />
             <AnimatedCircle
               cx="90"
               cy="90"
               r="60"
               stroke="#7C3AED"
               strokeWidth="5"
               fill="none"
               strokeDasharray="377"
               animatedProps={progressStyle}
               strokeLinecap="round"
               transform="rotate(-90 90 90)"
             />
          </Svg>
        </View>

        <Animated.View entering={FadeInDown.duration(600)} className="h-10 items-center justify-center w-3/4">
          <Animated.Text 
            key={textIndex} 
            entering={FadeIn.duration(400)} 
            exiting={FadeOut.duration(400)} 
            className="text-textPrimary text-[20px] font-extrabold text-center tracking-wide"
          >
            {LOADING_TEXTS[textIndex]}
          </Animated.Text>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}
