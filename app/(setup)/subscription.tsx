import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Button } from '@/components/atoms/Button';

const PLANS = [
  {
    id: 'free',
    label: 'Free',
    price: '₹0',
    period: 'forever',
    gradient: ['#F3F4F6', '#E5E7EB'] as const,
    textColor: Colors.text,
    features: ['3 workouts / week', 'Basic meal tracking', 'Community access', 'Limited AI coach'],
    cta: 'Start Free',
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '₹499',
    period: 'per month',
    gradient: Colors.gradPrimary,
    textColor: '#fff',
    features: ['Unlimited workouts', 'Full diet planner', 'AI coach — unlimited', 'Progress analytics', '1 consultation / month'],
    cta: 'Start Pro — ₹499/mo',
    popular: true,
  },
  {
    id: 'premium',
    label: 'Premium',
    price: '₹3,999',
    period: 'per year (save 33%)',
    gradient: Colors.gradNight,
    textColor: '#fff',
    features: ['Everything in Pro', '4 consultations / month', 'Personal trainer access', 'Blood test analysis', 'Priority support'],
    cta: 'Start Premium — ₹3,999/yr',
  },
];

export default function Subscription() {
  const [selected, setSelected] = useState('pro');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20, color: Colors.text }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Choose your plan</Text>
        <Text style={styles.subtitle}>Unlock your full wellness journey</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {PLANS.map((plan) => (
          <TouchableOpacity key={plan.id} onPress={() => setSelected(plan.id)} activeOpacity={0.9}>
            <LinearGradient
              colors={plan.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.planCard, selected === plan.id && styles.planCardSelected]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>⭐ MOST POPULAR</Text>
                </View>
              )}
              <View style={styles.planTop}>
                <View>
                  <Text style={[styles.planLabel, { color: plan.textColor }]}>{plan.label}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                    <Text style={[styles.price, { color: plan.textColor }]}>{plan.price}</Text>
                    <Text style={{ fontSize: 13, color: plan.textColor, opacity: 0.7, paddingBottom: 4 }}>
                      {plan.period}
                    </Text>
                  </View>
                </View>
                <View style={[styles.radio, selected === plan.id && styles.radioSelected]}>
                  {selected === plan.id && <View style={styles.radioDot} />}
                </View>
              </View>

              <View style={styles.dividerLine} />

              <View style={{ gap: 10 }}>
                {plan.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Text style={{ color: plan.textColor, opacity: 0.8, fontSize: 14 }}>✓</Text>
                    <Text style={[styles.featureText, { color: plan.textColor }]}>{f}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <Button
          label={PLANS.find((p) => p.id === selected)?.cta ?? 'Continue'}
          onPress={() => router.replace('/(app)')}
        />

        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={styles.legal}>Cancel anytime. No hidden fees.</Text>
          <Text style={styles.legal}>By subscribing you agree to our Terms & Privacy Policy.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: FontWeight.extrabold, color: Colors.text },
  subtitle: { fontSize: 15, color: Colors.textSecondary },
  content: { padding: 20, gap: 14, paddingBottom: 48 },
  planCard: { borderRadius: 24, padding: 20, gap: 16, ...Shadow.md },
  planCardSelected: { ...Shadow.lg },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  popularText: { fontSize: 11, fontWeight: FontWeight.bold, color: '#fff', letterSpacing: 1 },
  planTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planLabel: { fontSize: 13, fontWeight: FontWeight.semibold, opacity: 0.8, marginBottom: 2 },
  price: { fontSize: 30, fontWeight: FontWeight.extrabold },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.2)' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  dividerLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  featureText: { fontSize: 14, flex: 1, lineHeight: 20 },
  legal: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 17 },
});
