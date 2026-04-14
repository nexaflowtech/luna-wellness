import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Sparkles } from 'lucide-react-native';

export default function AiPlanResult() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.sparkleBg}>
            <Sparkles color="#6EE7B7" size={32} />
          </View>
          <Text style={styles.title}>Your AI Plan is Ready</Text>
          <Text style={styles.subtitle}>
            We've analyzed your profile and crafted a path to reach your health goals.
          </Text>
        </View>

        <LinearGradient
          colors={['#6EE7B7', '#818CF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Plan Summary</Text>

            <View style={styles.benefitRow}>
              <CheckCircle2 color="#6EE7B7" size={20} />
              <Text style={styles.benefitText}>Hormonal Balance Focus</Text>
            </View>
            <View style={styles.benefitRow}>
              <CheckCircle2 color="#6EE7B7" size={20} />
              <Text style={styles.benefitText}>Personalized Nutrition Path</Text>
            </View>
            <View style={styles.benefitRow}>
              <CheckCircle2 color="#6EE7B7" size={20} />
              <Text style={styles.benefitText}>Adaptive Workout Regimen</Text>
            </View>
            <View style={styles.benefitRow}>
              <CheckCircle2 color="#6EE7B7" size={20} />
              <Text style={styles.benefitText}>Daily Wellness Tracking</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(program)/recommendation')}
        >
          <Text style={styles.buttonText}>View My Program</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B14',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sparkleBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(110, 231, 183, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 24,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 22,
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#E2E8F0',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#6EE7B7',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#080B14',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
