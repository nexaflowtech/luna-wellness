import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Radius, Shadow, FontWeight } from '@/constants/theme';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Badge } from '@/components/atoms/Badge';
import type { TodayWorkout } from '@/src/hooks/useDashboardData';

interface Props {
  data: TodayWorkout;
}

export const TodaysWorkoutWidget = memo(function TodaysWorkoutWidget({ data }: Props) {
  return (
    <TouchableOpacity onPress={() => router.push('/(secondary)/workout-detail')} activeOpacity={0.9}>
      <LinearGradient colors={Colors.gradPrimary} style={styles.card}>
        <View style={styles.topRow}>
          <Badge label="UPCOMING WORKOUT" variant="neutral" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Text style={{ fontSize: 22 }}>🏋️</Text>
        </View>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⏱ {data.durationMin} min</Text>
          <Text style={styles.metaText}>🔥 {data.kcal} kcal</Text>
          <Text style={styles.metaText}>• {data.level}</Text>
        </View>
        <ProgressBar
          value={data.progress}
          color="rgba(255,255,255,0.9)"
          trackColor="rgba(255,255,255,0.25)"
          style={{ marginTop: 6 }}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {data.progress > 0 ? `${data.progress}% complete — continue →` : 'Tap to start your session →'}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: Radius['2xl'], padding: 20, gap: 10, ...Shadow.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: FontWeight.extrabold, color: '#fff', marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: 14 },
  metaText: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  footer: { alignItems: 'flex-end', marginTop: 4 },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: FontWeight.semibold },
});
