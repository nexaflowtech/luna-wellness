import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Button } from '@/components/atoms/Button';
import { ProgressBar } from '@/components/atoms/ProgressBar';

const STEPS = [
  {
    key: 'goals',
    title: 'What are your goals?',
    subtitle: 'Choose all that apply',
    options: [
      { emoji: '⚖️', label: 'Lose weight' },
      { emoji: '💪', label: 'Build muscle' },
      { emoji: '🧘', label: 'Reduce stress' },
      { emoji: '❤️', label: 'Improve heart health' },
      { emoji: '😴', label: 'Sleep better' },
      { emoji: '🏃', label: 'Boost energy' },
    ],
    multiSelect: true,
  },
  {
    key: 'fitness',
    title: 'Current fitness level?',
    subtitle: "Be honest — we'll tailor it perfectly",
    options: [
      { emoji: '🌱', label: 'Beginner (rarely exercise)' },
      { emoji: '🚶', label: 'Light (1–2x per week)' },
      { emoji: '🏋️', label: 'Moderate (3–4x per week)' },
      { emoji: '⚡', label: 'Advanced (5+ x per week)' },
    ],
    multiSelect: false,
  },
  {
    key: 'diet',
    title: 'Dietary preference?',
    subtitle: 'Your meal plans will match this',
    options: [
      { emoji: '🥗', label: 'Vegetarian' },
      { emoji: '🌱', label: 'Vegan' },
      { emoji: '🐟', label: 'Pescatarian' },
      { emoji: '🥩', label: 'Non-vegetarian' },
      { emoji: '🥑', label: 'Keto / Low-carb' },
      { emoji: '🍞', label: 'No preference' },
    ],
    multiSelect: false,
  },
];

export default function HealthAssessment() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const toggle = (label: string) => {
    const key = current.key;
    const prev = selections[key] ?? [];
    if (current.multiSelect) {
      setSelections((s) => ({
        ...s,
        [key]: prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
      }));
    } else {
      setSelections((s) => ({ ...s, [key]: [label] }));
    }
  };

  const isSelected = (label: string) => (selections[current.key] ?? []).includes(label);

  const handleNext = () => {
    if (step < STEPS.length - 1) { setStep(step + 1); }
    else { router.push('/(setup)/program-recommendation'); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradPrimary} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={step > 0 ? () => setStep(step - 1) : () => router.back()} style={styles.backBtn}>
            <Text style={{ color: '#fff', fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>STEP {step + 1} OF {STEPS.length}</Text>
          <View style={{ width: 38 }} />
        </View>
        <ProgressBar value={progress} color="rgba(255,255,255,0.9)" trackColor="rgba(255,255,255,0.25)" style={{ marginTop: 8 }} />
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {current.options.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              onPress={() => toggle(opt.label)}
              style={[styles.optionCard, isSelected(opt.label) && styles.optionCardActive]}
            >
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={[styles.optionLabel, isSelected(opt.label) && { color: Colors.primary }]}>
                {opt.label}
              </Text>
              {isSelected(opt.label) && (
                <View style={styles.checkBadge}>
                  <Text style={{ fontSize: 10, color: '#fff' }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label={step === STEPS.length - 1 ? 'See My Plan →' : 'Continue →'}
          onPress={handleNext}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 24,
    gap: 10,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { fontSize: 12, fontWeight: FontWeight.bold, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5 },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: '#fff', marginTop: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  content: { padding: 20, gap: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  optionCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 18,
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionEmoji: { fontSize: 28 },
  optionLabel: { fontSize: 13, fontWeight: FontWeight.semibold, color: Colors.text },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
