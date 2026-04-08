import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Badge } from '@/components/atoms/Badge';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'Yoga', 'HIIT', 'Mobility'];
const WORKOUTS = [
  { id: '1', emoji: '🏋️', title: 'Full Body Strength', duration: '35 min', level: 'Intermediate', kcal: 280, category: 'Strength', gradient: Colors.gradPrimary },
  { id: '2', emoji: '⚡', title: 'HIIT Cardio Blast', duration: '20 min', level: 'Advanced', kcal: 320, category: 'HIIT', gradient: Colors.gradSunrise },
  { id: '3', emoji: '🧘', title: 'Morning Yoga Flow', duration: '25 min', level: 'Beginner', kcal: 120, category: 'Yoga', gradient: Colors.gradOcean },
  { id: '4', emoji: '🤸', title: 'Core & Flexibility', duration: '30 min', level: 'Intermediate', kcal: 180, category: 'Mobility', gradient: Colors.gradForest },
  { id: '5', emoji: '🏃', title: 'Endurance Run', duration: '40 min', level: 'Advanced', kcal: 400, category: 'Cardio', gradient: Colors.gradSunrise },
  { id: '6', emoji: '💪', title: 'Upper Body Pump', duration: '28 min', level: 'Intermediate', kcal: 240, category: 'Strength', gradient: Colors.gradPrimary },
];

const LEVEL_COLOR: Record<string, 'success' | 'warning' | 'error'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'error',
};

export default function WorkoutLibrary() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? WORKOUTS : WORKOUTS.filter((w) => w.category === cat);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradPrimary} style={styles.header}>
        <Text style={styles.title}>Workouts 💪</Text>
        <Text style={styles.subtitle}>Pick today's session</Text>
      </LinearGradient>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCat(c)}
            style={[styles.chip, cat === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, cat === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map((w) => (
          <TouchableOpacity
            key={w.id}
            onPress={() => router.push('/(app)/(workout)/player')}
            activeOpacity={0.9}
          >
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
                <View style={{ alignItems: 'flex-end', gap: 8 }}>
                  <Badge label={w.level} variant={LEVEL_COLOR[w.level]} />
                  <View style={styles.playBtn}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 4,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  chips: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },
  content: { padding: 20, paddingTop: 4, gap: 14, paddingBottom: 40 },
  workoutCard: { borderRadius: 24, padding: 20, ...Shadow.md },
  cardInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  emoji: { fontSize: 36 },
  workoutTitle: { fontSize: 17, fontWeight: FontWeight.bold, color: '#fff' },
  metaRow: { flexDirection: 'row', gap: 14 },
  metaText: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 12, color: '#fff' },
});
