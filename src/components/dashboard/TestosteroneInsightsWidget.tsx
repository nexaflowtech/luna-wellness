import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Shadow, FontWeight } from '@/constants/theme';
import { Card } from '@/components/molecules/Card';
import type { HormoneScore } from '@/src/hooks/useDashboardData';

interface Props {
  data: HormoneScore;
}

export function TestosteroneInsightsWidget({ data }: Props) {
  const trendColor =
    data.trend === 'Improving' ? Colors.success :
    data.trend === 'Declining' ? Colors.warning : Colors.info;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 24 }}>⚡</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Recovery & Hormones</Text>
          <Text style={styles.score}>
            {data.score}
            <Text style={{ fontSize: 14, color: Colors.textMuted }}>
              / 100  •  {data.label}
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          <Text style={{ fontWeight: 'bold' }}>Trend: </Text>
          <Text style={{ color: trendColor }}>{data.trend}</Text>
          {data.trend === 'Declining'
            ? ' — High stress detected. Prioritize 8 hours sleep tonight.'
            : data.trend === 'Improving'
            ? ' — Great momentum. Keep up your current routine.'
            : ' — Your levels look balanced. Maintain consistency.'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnOutline}>
          <Text style={styles.btnOutlineText}>Log Bloodwork</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSolid}>
          <Text style={styles.btnSolidText}>View Trends</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, backgroundColor: Colors.card, ...Shadow.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.textSecondary, textTransform: 'uppercase' },
  score: { fontSize: 26, fontWeight: FontWeight.extrabold, color: Colors.text },
  warningBox: { backgroundColor: Colors.warningLight, padding: 12, borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)' },
  warningText: { fontSize: 13, color: Colors.warning, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 8 },
  btnOutline: { flex: 1, borderWidth: 1.5, borderColor: Colors.border, paddingVertical: 10, borderRadius: Radius.lg, alignItems: 'center' },
  btnOutlineText: { fontSize: 13, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  btnSolid: { flex: 1, backgroundColor: Colors.primaryLight, paddingVertical: 10, borderRadius: Radius.lg, alignItems: 'center' },
  btnSolidText: { fontSize: 13, fontWeight: FontWeight.semibold, color: Colors.primary },
});
