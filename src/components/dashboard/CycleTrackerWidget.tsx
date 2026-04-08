import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadow, FontWeight } from '@/constants/theme';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import type { CycleSummary } from '@/src/hooks/useDashboardData';

interface Props {
  data: CycleSummary;
}

export const CycleTrackerWidget = memo(function CycleTrackerWidget({ data }: Props) {
  const progress = (data.day / data.cycleLength) * 100;

  return (
    <LinearGradient colors={Colors.gradOcean} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Text style={{ fontSize: 18 }}>🌸</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Cycle Tracker</Text>
          <Text style={styles.subtitle}>Day {data.day} • {data.currentPhase}</Text>
        </View>
      </View>

      <ProgressBar value={progress} color="#fff" trackColor="rgba(255,255,255,0.25)" />

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{data.tip}</Text>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Log Symptoms</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: Radius['2xl'], padding: 20, gap: 14, ...Shadow.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center'
  },
  title: { fontSize: 13, fontWeight: FontWeight.semibold, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' },
  subtitle: { fontSize: 20, fontWeight: FontWeight.bold, color: '#fff' },
  infoRow: { backgroundColor: 'rgba(0,0,0,0.1)', padding: 12, borderRadius: Radius.lg },
  infoText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 18 },
  btn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, borderRadius: Radius.lg, alignItems: 'center' },
  btnText: { fontSize: 14, fontWeight: FontWeight.semibold, color: '#fff' },
});
