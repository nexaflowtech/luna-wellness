import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { ProgressBar } from '@/components/atoms/ProgressBar';

const HABITS = [
  { id: '1', label: 'Drink 8 glasses of water', emoji: '💧', category: 'Health', done: true, streak: 14 },
  { id: '2', label: '30 min workout', emoji: '🏃', category: 'Fitness', done: true, streak: 7 },
  { id: '3', label: 'Meditate 10 minutes', emoji: '🧘', category: 'Mindfulness', done: true, streak: 21 },
  { id: '4', label: 'Sleep by 10:30 PM', emoji: '😴', category: 'Sleep', done: false, streak: 3 },
  { id: '5', label: 'Read 20 pages', emoji: '📚', category: 'Growth', done: false, streak: 5 },
  { id: '6', label: 'No sugar today', emoji: '🍎', category: 'Nutrition', done: false, streak: 0 },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState(HABITS);
  const done = habits.filter((h) => h.done).length;
  const pct = (done / habits.length) * 100;

  const toggle = (id: string) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradPrimary} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Today's Habits ✅</Text>
            <Text style={styles.subtitle}>Sunday, 30 March</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Completion ring */}
        <View style={styles.progressCard}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={styles.progressLabel}>{done} of {habits.length} completed</Text>
            <ProgressBar value={pct} color={Colors.success} trackColor={Colors.successLight} />
            {done === habits.length && (
              <Text style={styles.perfectText}>🎉 Perfect day! Streak extended!</Text>
            )}
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPct}>{Math.round(pct)}%</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {habits.map((h) => (
          <TouchableOpacity
            key={h.id}
            onPress={() => toggle(h.id)}
            activeOpacity={0.85}
            style={[styles.habitCard, h.done && styles.habitCardDone]}
          >
            <Text style={styles.habitEmoji}>{h.emoji}</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.habitLabel, h.done && styles.habitLabelDone]}>
                {h.label}
              </Text>
              <Text style={styles.habitMeta}>{h.category} · 🔥 {h.streak} day streak</Text>
            </View>
            <View style={[styles.checkbox, h.done && styles.checkboxDone]}>
              {h.done && <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}

        {/* Add habit */}
        <TouchableOpacity style={styles.addHabit}>
          <Text style={styles.addHabitText}>+ Add new habit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...Shadow.sm,
  },
  progressLabel: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.text },
  perfectText: { fontSize: 13, color: Colors.success, fontWeight: FontWeight.medium },
  progressCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPct: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.primary },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  habitCardDone: { borderColor: Colors.success, backgroundColor: Colors.successLight },
  habitEmoji: { fontSize: 26 },
  habitLabel: { fontSize: 15, fontWeight: FontWeight.semibold, color: Colors.text },
  habitLabelDone: { color: Colors.success, textDecorationLine: 'line-through' },
  habitMeta: { fontSize: 12, color: Colors.textMuted },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  addHabit: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addHabitText: { fontSize: 15, fontWeight: FontWeight.semibold, color: Colors.primary },
});
