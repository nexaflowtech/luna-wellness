import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, ArrowUp, ArrowDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { useUser } from '@/src/context/UserContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function RiskScoreScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const progress = useSharedValue(0);
  const score = Number(profile?.riskScore ?? 74);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const circumference = 2 * Math.PI * 88;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const handleContinue = () => {
    router.push('/(program)/recommendation');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* Top Navigation */}
      <View className="w-full flex-row items-center px-6 pt-4 mb-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center">
           <ArrowLeft color="#181b27" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8 mt-2">
          <Text className="font-headline font-extrabold text-4xl tracking-tight text-on-surface mb-2">
            Your Hormonal Insights
          </Text>
          <Text className="text-on-surface-variant/70 text-base font-medium">
            Based on your initial profiling.
          </Text>
        </View>

        {/* Gauge Card */}
        <View className="bg-surface-container-low rounded-2xl p-8 items-center justify-center mb-6 shadow-sm">
          <Text className="font-headline font-bold text-xl mb-6 text-on-surface">
            Balance Score
          </Text>
          
          <View className="relative w-48 h-48 items-center justify-center">
            <Svg width="100%" height="100%" viewBox="0 0 192 192" style={{ transform: [{ rotate: '-90deg' }] }}>
              <Defs>
                <SvgLinearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#b7004e" />
                  <Stop offset="100%" stopColor="#e21364" />
                </SvgLinearGradient>
              </Defs>
              <Circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e6e7f8" // surface-container-high
                strokeWidth="12"
                fill="transparent"
              />
              <AnimatedCircle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gauge-grad)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeLinecap="round"
                animatedProps={animatedProps}
              />
            </Svg>
            <View className="absolute inset-0 flex flex-col items-center justify-center">
              <Text className="font-headline font-black text-4xl text-primary">{score}%</Text>
              <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">
                Attention Needed
              </Text>
            </View>
          </View>
          
          <Text className="mt-6 text-sm text-on-surface-variant leading-relaxed text-center">
            Your balance is slightly below the optimal range for this phase of your cycle.
          </Text>
        </View>

        {/* AI Insight Card */}
        <View className="bg-primary rounded-2xl p-6 relative overflow-hidden mb-6">
           <LinearGradient
              colors={['#b7004e', '#e21364']}
              className="absolute inset-0"
           />
           {/* Abstract Decoration */}
           <View className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl z-0" />
           
           <View className="relative z-10">
             <View className="flex-row items-center gap-2 mb-4">
               <Sparkles color="#ffffff" size={20} style={{ opacity: 0.9 }} />
               <Text className="font-headline font-bold text-lg text-white/90">
                 AI Health Insight
               </Text>
             </View>
             <Text className="font-headline font-semibold text-2xl leading-snug text-white">
               "Your specific profile indicates a slight imbalance. This might explain your recent energy dips."
             </Text>
             
             <View className="mt-8 flex-row items-center gap-4">
                <TouchableOpacity className="bg-surface-container-lowest px-6 py-3 rounded-full active:scale-95 transition-transform">
                  <Text className="text-primary font-bold text-sm tracking-wide">Read Analysis</Text>
                </TouchableOpacity>
             </View>
           </View>
        </View>

        {/* Mini Stats Grid (Optional translation from HTML) */}
        <View className="flex-row gap-4">
          <View className="flex-1 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm">
             <View className="flex-row justify-between mb-3">
                <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Estrogen</Text>
                <View className="flex-row items-center">
                  <ArrowUp color="#b7004e" size={12} strokeWidth={3} />
                  <Text className="text-[10px] font-bold text-primary ml-1">12%</Text>
                </View>
             </View>
             <View className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <View className="h-full bg-primary rounded-full w-[65%]" />
             </View>
          </View>
          <View className="flex-1 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm">
             <View className="flex-row justify-between mb-3">
                <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Progesterone</Text>
                <View className="flex-row items-center">
                  <ArrowDown color="#ba1a1a" size={12} strokeWidth={3} />
                  <Text className="text-[10px] font-bold text-error ml-1">5%</Text>
                </View>
             </View>
             <View className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <View className="h-full bg-error rounded-full w-[25%]" />
             </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="absolute bottom-0 left-0 right-0 p-6 pt-16 bg-gradient-to-t from-surface via-surface to-transparent">
         <TouchableOpacity 
            activeOpacity={0.8} 
            className="w-full"
            onPress={handleContinue}
         >
            <LinearGradient
              colors={['#b7004e', '#e21364']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 rounded-full flex-row items-center justify-center gap-2 shadow-xl"
            >
              <Text className="text-white font-headline font-bold text-lg">
                See Your Program Match
              </Text>
            </LinearGradient>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
