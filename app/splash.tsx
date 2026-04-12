import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#080B14', alignItems: 'center', justifyContent: 'center' }}>
      {/* Soft mint ambient glow */}
      <View style={{
        position: 'absolute', width: 280, height: 280, borderRadius: 140,
        backgroundColor: 'rgba(110,231,183,0.07)',
      }} />

      {/* Gradient-bordered logo badge */}
      <LinearGradient
        colors={['#6EE7B7', '#818CF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 32, padding: 2, marginBottom: 28 }}
      >
        <View style={{
          backgroundColor: '#080B14', borderRadius: 30,
          width: 96, height: 96, alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 46, fontWeight: '900', color: '#F1F5F9' }}>L</Text>
        </View>
      </LinearGradient>

      <Text style={{ fontSize: 46, fontWeight: '900', color: '#F1F5F9', letterSpacing: -1, marginBottom: 10 }}>
        Luna
      </Text>

      <Text style={{ fontSize: 14, color: '#6EE7B7', fontWeight: '600', letterSpacing: 2.5, textTransform: 'uppercase' }}>
        Your AI Health Coach
      </Text>
    </View>
  );
}
