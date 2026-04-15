import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';
import { useAuth } from '@/src/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading, onboardingComplete, onboardingStep } = useAuth();

  // Shared values for animations
  const logoOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const dot1Opacity = useSharedValue(0.2);
  const dot2Opacity = useSharedValue(0.2);
  const dot3Opacity = useSharedValue(0.2);

  // Start animations immediately on mount
  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    taglineTranslateY.value = withDelay(
      400,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) })
    );

    const pulseConfig = { duration: 500, easing: Easing.inOut(Easing.ease) };
    dot1Opacity.value = withRepeat(
      withSequence(withTiming(1, pulseConfig), withTiming(0.2, pulseConfig)),
      -1,
      true
    );
    dot2Opacity.value = withDelay(
      200,
      withRepeat(
        withSequence(withTiming(1, pulseConfig), withTiming(0.2, pulseConfig)),
        -1,
        true
      )
    );
    dot3Opacity.value = withDelay(
      400,
      withRepeat(
        withSequence(withTiming(1, pulseConfig), withTiming(0.2, pulseConfig)),
        -1,
        true
      )
    );
  }, []);

  // Auth-aware navigation: fires exactly once when auth resolves.
  // Using a ref guard prevents re-triggering when onboardingStep
  // updates from Firestore after each onboarding screen write.
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

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    alignItems: 'center',
    marginBottom: 16,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
    alignItems: 'center',
  }));

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Faint Background Grid Pattern */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <Path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.025)"
                strokeWidth="1"
              />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grid)" />
        </Svg>
      </View>

      {/* Ambient Glow */}
      <View style={styles.glowPrimary} />
      <View style={styles.glowSecondary} />

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View style={logoStyle}>
          <Text style={styles.wordLuna}>Luna</Text>
          <Text style={styles.wordWellness}>Wellness</Text>
        </Animated.View>

        <Animated.View style={taglineStyle}>
          <View style={styles.decorativeLine} />
          <Text style={styles.tagline}>Your AI Health Coach</Text>
        </Animated.View>
      </View>

      {/* Loading Dots */}
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowPrimary: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(124,58,237,0.08)',
    top: '20%',
    alignSelf: 'center',
  },
  glowSecondary: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(244,114,182,0.05)',
    bottom: '20%',
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  wordLuna: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    textShadowColor: 'rgba(124,58,237,0.5)',
    textShadowRadius: 40,
    textShadowOffset: { width: 0, height: 0 },
  },
  wordWellness: {
    fontSize: 18,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 10,
    textTransform: 'uppercase',
    marginTop: -4,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: '#7C3AED',
    opacity: 0.8,
    marginBottom: 16,
    marginTop: 24,
  },
  tagline: {
    fontSize: 14,
    color: '#F472B6',
    letterSpacing: 3,
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
  },
});
