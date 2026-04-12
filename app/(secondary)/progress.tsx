// Inlined from deleted app/(app)/(progress)/index.tsx
// The legacy (app)/ group has been removed; this screen now lives directly in (secondary)/.
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadow, FontWeight, Radius } from '@/constants/theme';
import { StatCard } from '@/components/molecules/StatCard';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';

const METRICS = [
  { label: 'Weight', value: '72.3', unit: 'kg', trend: '−0.6 kg', pos: true, icon: '⚖️', gradient: Colors.gradPrimary },
  { label: 'BMI', value: '22.4', unit: 'kg/m²', trend: '14% body fat', pos: true, icon: '📊', gradient: Colors.gradOcean },
  { label: 'VO₂ Max', value: '43', unit: 'ml/kg', trend: '+1.5 last week', pos: true, icon: '💨', gradient: Colors.gradForest },
  { label: 'Resting HR', value: '63', unit: 'bpm', trend: '−3 bpm', pos: true, icon: '❤️', gradient: Colors.gradSunrise },
];

const WEEKLY_GOALS = [
  { label: 'Workouts completed', value: 4, max: 5, pct: 80, color: Colors.primary },
  { label: 'Daily calorie goal', value: 6, max: 7, pct: 86, color: Colors.success },
  { label: 'Hydration goal', value: 5, max: 7, pct: 71, color: Colors.info },
  { label: 'Sleep target', value: 4, max: 7, pct: 57, color: Colors.warning },
];

export default function ProgressTracking() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradNight} style={styles.header}>
        <Text style={styles.title}>Progress 📈</Text>
        <Text style={styles.subtitle}>Week of 24–30 March</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {METRICS.map((m) => (
            <StatCard
              key={m.label}
              label={m.label}
              value={m.value}
              unit={m.unit}
              trend={m.trend}
              trendPositive={m.pos}
              icon={m.icon}
              gradient={m.gradient}
              style={{ width: '48%' }}
            />
          ))}
        </View>

        {/* Weekly goals */}
        <Text style={styles.sectionTitle}>Weekly Goals</Text>
        <Card style={{ gap: 18 }}>
          {WEEKLY_GOALS.map((g) => (
            <View key={g.label} style={{ gap: 6 }}>
              <View style={styles.goalRow}>
                <Text style={styles.goalLabel}>{g.label}</Text>
                <Text style={styles.goalFrac}>{g.value}/{g.max}</Text>
              </View>
              <ProgressBar value={g.pct} color={g.color} showLabel />
            </View>
          ))}
        </Card>

        {/* Chart placeholder */}
        <Card style={{ gap: 16 }}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Weight Trend</Text>
            <Badge label="Last 30 days" variant="neutral" />
          </View>
          {/* TODO: Replace with react-native-svg line chart */}
          <View style={styles.chartPlaceholder}>
            {/* Simulated bar chart */}
            {[60, 75, 50, 90, 65, 80, 70].map((h, i) => (
              <View key={i} style={styles.chartBarWrap}>
                <LinearGradient
                  colors={Colors.gradPrimary}
                  style={[styles.chartBar, { height: `${h}%` as any }]}
                />
              </View>
            ))}
          </View>
          <View style={styles.chartFooter}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <Text key={d} style={styles.chartDay}>{d}</Text>
            ))}
          </View>
        </Card>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Recent Achievements 🏅</Text>
        <View style={styles.achieveRow}>
          {[
            { emoji: '🔥', label: '14-Day Streak' },
            { emoji: '💪', label: '10 Workouts' },
            { emoji: '⚖️', label: 'Goal −2 kg' },
            { emoji: '💧', label: '7-Day Hydration' },
          ].map((a) => (
            <View key={a.label} style={styles.achieveCard}>
              <LinearGradient colors={Colors.gradPrimary} style={styles.achieveCircle}>
                <Text style={{ fontSize: 22 }}>{a.emoji}</Text>
              </LinearGradient>
              <Text style={styles.achieveLabel}>{a.label}</Text>
            </View>
          ))}
        </View>
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
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 17, fontWeight: FontWeight.bold, color: Colors.text },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  goalLabel: { fontSize: 14, color: Colors.text, fontWeight: FontWeight.medium },
  goalFrac: { fontSize: 13, color: Colors.textMuted },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartPlaceholder: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 12,
  },
  chartBarWrap: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  chartBar: { borderRadius: 6, width: '100%' },
  chartFooter: { flexDirection: 'row', justifyContent: 'space-around' },
  chartDay: { fontSize: 11, color: Colors.textMuted },
  achieveRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achieveCard: { width: '22%', alignItems: 'center', gap: 8 },
  achieveCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  achieveLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', fontWeight: FontWeight.medium },
});
