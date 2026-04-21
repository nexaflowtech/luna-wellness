import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';
import { useAuth } from '@/src/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading, onboardingComplete, onboardingStep } = useAuth();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;
  const dot1Opacity = useRef(new Animated.Value(0.2)).current;
  const dot2Opacity = useRef(new Animated.Value(0.2)).current;
  const dot3Opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(taglineTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
      ]),
    ]).start();

    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.2, duration: 500, useNativeDriver: true }),
        ])
      ).start();

    pulse(dot1Opacity, 0);
    pulse(dot2Opacity, 200);
    pulse(dot3Opacity, 400);
  }, []);

  const hasNavigated = React.useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (hasNavigated.current) return;

    const MIN_DISPLAY_MS = 2000;
    const timer = setTimeout(() => {
      hasNavigated.current = true;
      if (!user) {
        router.replace('/(onboarding)/login');
      } else if (!onboardingComplete) {
        const resumeStep = onboardingStep || '/(onboarding)/gender';
        console.log('Resuming onboarding at:', resumeStep);
        router.replace(resumeStep as any);
      } else {
        router.replace('/(tabs)');
      }
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [isLoading, user, onboardingComplete, onboardingStep]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <Path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grid)" />
        </Svg>
      </View>

      <View style={styles.glowPrimary} />
      <View style={styles.glowSecondary} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
          <Text style={styles.wordLuna}>Luna</Text>
          <Text style={styles.wordWellness}>Wellness</Text>
        </Animated.View>

        <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity, transform: [{ translateY: taglineTranslateY }] }]}>
          <View style={styles.decorativeLine} />
          <Text style={styles.tagline}>Your AI Health Coach</Text>
        </Animated.View>
      </View>

      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F', alignItems: 'center', justifyContent: 'center' },
  glowPrimary: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(124,58,237,0.08)', top: '20%', alignSelf: 'center' },
  glowSecondary: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(244,114,182,0.05)', bottom: '20%', alignSelf: 'center' },
  content: { alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  wordLuna: { fontSize: 72, fontWeight: '900', color: '#FFFFFF', letterSpacing: 6, textShadowColor: 'rgba(124,58,237,0.5)', textShadowRadius: 40, textShadowOffset: { width: 0, height: 0 } },
  wordWellness: { fontSize: 18, fontWeight: '300', color: 'rgba(255,255,255,0.4)', letterSpacing: 10, textTransform: 'uppercase', marginTop: -4 },
  taglineContainer: { alignItems: 'center' },
  decorativeLine: { width: 40, height: 2, backgroundColor: '#7C3AED', opacity: 0.8, marginBottom: 16, marginTop: 24 },
  tagline: { fontSize: 14, color: '#F472B6', letterSpacing: 3, fontWeight: '400', textTransform: 'uppercase' },
  dotsContainer: { position: 'absolute', bottom: 80, flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7C3AED' },
});
