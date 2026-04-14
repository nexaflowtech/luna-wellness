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
  Easing
} from 'react-native-reanimated';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';

export default function SplashScreen() {
  const router = useRouter();

  // Shared values for animations
  const logoOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  
  const dot1Opacity = useSharedValue(0.2);
  const dot2Opacity = useSharedValue(0.2);
  const dot3Opacity = useSharedValue(0.2);

  useEffect(() => {
    // 1. Logo fade in over 800ms
    logoOpacity.value = withTiming(1, { 
      duration: 800, 
      easing: Easing.out(Easing.ease) 
    });

    // 2. Tagline fade and slide with 400ms delay
    taglineOpacity.value = withDelay(
      400, 
      withTiming(1, { duration: 600 })
    );
    taglineTranslateY.value = withDelay(
      400, 
      withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) })
    );

    // 3. Loading dots pulsing animation
    const pulseConfig = { duration: 500, easing: Easing.inOut(Easing.ease) };
    
    // Animate each dot sequentially for a wave effect
    dot1Opacity.value = withRepeat(
      withSequence(withTiming(1, pulseConfig), withTiming(0.2, pulseConfig)),
      -1, true
    );
    dot2Opacity.value = withDelay(200, withRepeat(
      withSequence(withTiming(1, pulseConfig), withTiming(0.2, pulseConfig)),
      -1, true
    ));
    dot3Opacity.value = withDelay(400, withRepeat(
      withSequence(withTiming(1, pulseConfig), withTiming(0.2, pulseConfig)),
      -1, true
    ));

    // 4. Auto navigate after 3000ms
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  // Animated Styles
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
              <Path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grid)" />
        </Svg>
      </View>

      {/* Subtle Radial Gradient Glow */}
      <View style={styles.glow} />

      {/* Main Content Area */}
      <View style={styles.content}>
        <Animated.View style={logoStyle}>
          <Text style={styles.logoText}>Luna</Text>
        </Animated.View>

        <Animated.View style={taglineStyle}>
          <View style={styles.decorativeLine} />
          <Text style={styles.tagline}>Your AI Health Coach</Text>
        </Animated.View>
      </View>

      {/* Bottom Loading Dots */}
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
    backgroundColor: '#080B14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(110,231,183,0.08)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#F1F5F9',
    letterSpacing: 6,
    textShadowColor: 'rgba(110, 231, 183, 0.4)',
    textShadowRadius: 30,
    textShadowOffset: { width: 0, height: 0 },
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: '#6EE7B7',
    opacity: 0.6,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: '#6EE7B7',
    letterSpacing: 3,
    marginTop: 12,
    fontWeight: '300',
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
    backgroundColor: '#6EE7B7',
  },
});
