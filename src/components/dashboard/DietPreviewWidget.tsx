import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Shadow, FontWeight } from '@/constants/theme';
import { Card } from '@/components/molecules/Card';
import type { DietPlan } from '@/src/hooks/useDashboardData';

interface Props {
  data: DietPlan;
}

export function DietPreviewWidget({ data }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Next Meal 🥗</Text>
        <Text style={styles.link}>View Plan</Text>
      </View>

      <View style={styles.mealBox}>
        <View style={styles.timeWrap}>
          <Text style={styles.timeText}>{data.mealTime}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.mealName}>{data.mealName}</Text>
          <Text style={styles.mealDesc}>{data.description}</Text>
        </View>
      </View>

      <View style={styles.macroRow}>
        {[
          { label: 'Kcal', val: String(data.kcal), color: Colors.warning },
          { label: 'Protein', val: data.protein, color: Colors.info },
          { label: 'Carbs', val: data.carbs, color: Colors.success },
        ].map(m => (
          <View key={m.label} style={styles.macroItem}>
            <Text style={[styles.macroVal, { color: m.color }]}>{m.val}</Text>
            <Text style={styles.macroLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14, ...Shadow.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.text },
  link: { fontSize: 13, color: Colors.primary, fontWeight: FontWeight.semibold },
  mealBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.background, padding: 12, borderRadius: Radius.xl },
  timeWrap: { backgroundColor: Colors.card, paddingVertical: 6, paddingHorizontal: 10, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  timeText: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.text },
  mealName: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.text },
  mealDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  macroItem: { alignItems: 'center' },
  macroVal: { fontSize: 16, fontWeight: FontWeight.bold },
  macroLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
});
