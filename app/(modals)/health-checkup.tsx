import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Badge } from '@/components/atoms/Badge';
import { Card } from '@/components/molecules/Card';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Button } from '@/components/atoms/Button';

type Severity = 'success' | 'warning' | 'error';

const VITALS = [
  { id: '1', title: 'Blood Pressure', value: '118 / 76', unit: 'mmHg', icon: '❤️', status: 'Normal', severity: 'success' as Severity, pct: 88, trend: '−2 last week' },
  { id: '2', title: 'Blood Sugar (Fasting)', value: '92', unit: 'mg/dL', icon: '🩸', status: 'Normal', severity: 'success' as Severity, pct: 82, trend: 'Stable' },
  { id: '3', title: 'BMI', value: '22.4', unit: 'kg/m²', icon: '⚖️', status: 'Healthy', severity: 'success' as Severity, pct: 76, trend: '−0.3 this month' },
  { id: '4', title: 'Sleep Quality', value: '6.8', unit: 'hrs avg', icon: '😴', status: 'Fair', severity: 'warning' as Severity, pct: 57, trend: 'Needs attention' },
  { id: '5', title: 'Stress Score', value: '3.4', unit: '/ 10', icon: '🧠', status: 'Low', severity: 'success' as Severity, pct: 90, trend: '−1.2 vs last week' },
  { id: '6', title: 'Resting Heart Rate', value: '63', unit: 'bpm', icon: '💓', status: 'Excellent', severity: 'success' as Severity, pct: 92, trend: '−4 bpm improved' },
];

export default function HealthCheckup() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradOcean} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Health Checkup 🩺</Text>
            <Text style={styles.subtitle}>Last updated: Today, 8:32 AM</Text>
          </View>
        </View>

        {/* Overall score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>Overall Health Score</Text>
            <Text style={styles.scoreVal}>87<Text style={styles.scoreMax}> / 100</Text></Text>
            <Badge label="Good condition" variant="success" dot />
          </View>
          <View style={styles.scoreCircle}>
            <Text style={{ fontSize: 36 }}>🌟</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Vital Signs</Text>

        {VITALS.map((v) => (
          <Card key={v.id} style={styles.vitalCard}>
            <View style={styles.vitalTop}>
              <Text style={styles.vitalIcon}>{v.icon}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.vitalTitle}>{v.title}</Text>
                <Text style={styles.vitalTrend}>{v.trend}</Text>
              </View>
              <View style={styles.vitalRight}>
                <Text style={styles.vitalValue}>{v.value}</Text>
                <Text style={styles.vitalUnit}>{v.unit}</Text>
              </View>
            </View>
            <View style={styles.vitalBottom}>
              <ProgressBar value={v.pct} color={
                v.severity === 'success' ? Colors.success
                : v.severity === 'warning' ? Colors.warning
                : Colors.error
              } />
              <Badge label={v.status} variant={v.severity} style={{ marginTop: 4 }} />
            </View>
          </Card>
        ))}

        <Button label="📝 Log New Reading" onPress={() => {}} variant="secondary" />
        <Button label="📋 Full Health Report" onPress={() => {}} variant="outline" />
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
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  title: { fontSize: 22, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLeft: { gap: 6 },
  scoreLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: FontWeight.medium },
  scoreVal: { fontSize: 40, fontWeight: FontWeight.extrabold, color: '#fff' },
  scoreMax: { fontSize: 18, fontWeight: FontWeight.regular },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  sectionTitle: { fontSize: 17, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 4 },
  vitalCard: { gap: 12 },
  vitalTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vitalIcon: { fontSize: 28 },
  vitalTitle: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.text },
  vitalTrend: { fontSize: 12, color: Colors.textMuted },
  vitalRight: { alignItems: 'flex-end' },
  vitalValue: { fontSize: 22, fontWeight: FontWeight.bold, color: Colors.text },
  vitalUnit: { fontSize: 11, color: Colors.textMuted },
  vitalBottom: { gap: 6 },
});
