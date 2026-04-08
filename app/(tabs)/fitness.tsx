import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Radius, FontWeight, Shadow } from '@/src/constants/theme';
import { Badge } from '@/src/components/atoms/Badge';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'Yoga', 'HIIT', 'Mobility'];
const WORKOUTS = [
  { id: '1', emoji: '🏋️', title: 'Full Body Strength', duration: '35 min', level: 'Intermediate', kcal: 280, category: 'Strength', gradient: ['#b7004e', '#e21364'] as const },
  { id: '2', emoji: '⚡', title: 'HIIT Cardio Blast', duration: '20 min', level: 'Advanced', kcal: 320, category: 'HIIT', gradient: ['#fc695d', '#e21364'] as const },
  { id: '3', emoji: '🧘', title: 'Morning Yoga Flow', duration: '25 min', level: 'Beginner', kcal: 120, category: 'Yoga', gradient: ['#c7aa00', '#6e5d00'] as const },
];

const LEVEL_COLOR: Record<string, 'success' | 'warning' | 'error'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'error',
};

export default function FitnessScreen() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? WORKOUTS : WORKOUTS.filter((w) => w.category === cat);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#b7004e', '#e21364']} style={styles.header}>
        <Text style={styles.title}>Fitness</Text>
        <Text style={styles.subtitle}>Today's workout recommendations</Text>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCat(c)} style={[styles.chip, cat === c && styles.chipActive]}>
            <Text style={[styles.chipText, cat === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map((w) => (
          <TouchableOpacity key={w.id} onPress={() => router.push('/(secondary)/workout-detail' as any)} activeOpacity={0.9}>
            <LinearGradient colors={w.gradient} style={styles.workoutCard}>
              <View style={styles.cardInner}>
                <Text style={styles.emoji}>{w.emoji}</Text>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.workoutTitle}>{w.title}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>⏱ {w.duration}</Text>
                    <Text style={styles.metaText}>🔥 {w.kcal} kcal</Text>
                  </View>
                </View>
                <Badge label={w.level} variant={LEVEL_COLOR[w.level]} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  chips: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: '#e4bdc3', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#b7004e', borderColor: '#b7004e' },
  chipText: { fontSize: 13, fontWeight: FontWeight.medium, color: '#5b3f44' },
  chipTextActive: { color: '#fff' },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  workoutCard: { borderRadius: 24, padding: 20, ...Shadow.md },
  cardInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  emoji: { fontSize: 32 },
  workoutTitle: { fontSize: 17, fontWeight: FontWeight.bold, color: '#fff' },
  metaRow: { flexDirection: 'row', gap: 14 },
  metaText: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
});
