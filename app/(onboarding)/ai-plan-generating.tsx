import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LOADING_TEXTS = [
  "Luna is building your plan...",
  "Analyzing hormonal markers...",
  "Optimizing nutrition macros...",
  "Personalizing your journey..."
];

export default function AiPlanGenerating() {
  const router = useRouter();
  const [textIndex, setTextIndex] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 3000, easing: Easing.linear });

    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 800);

    const timeout = setTimeout(() => {
      router.push('/(onboarding)/ai-plan-result');
    }, 3000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(timeout);
    };
  }, []);

  const animatedProps = useAnimatedStyle(() => {
    const strokeDashoffset = interpolate(
      progress.value,
      [0, 1],
      [300, 0],
      Extrapolate.CLAMP
    );
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.ringContainer}>
          <Svg width="120" height="120" viewBox="0 0 120 120">
            <Circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(110, 231, 183, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            <AnimatedCircle
              cx="60"
              cy="60"
              r="50"
              stroke="#6EE7B7"
              strokeWidth="8"
              fill="none"
              strokeDasharray="314"
              animatedProps={animatedProps}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </Svg>
        </View>

        <Animated.Text style={styles.text}>
          {LOADING_TEXTS[textIndex]}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  ringContainer: {
    marginBottom: 40,
  },
  text: {
    color: '#6EE7B7',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
