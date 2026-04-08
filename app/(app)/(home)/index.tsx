import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/userStore';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Avatar } from '@/components/atoms/Avatar';
import { StatCard } from '@/components/molecules/StatCard';
import { Badge } from '@/components/atoms/Badge';

import { CycleTrackerWidget } from '@/components/dashboard/CycleTrackerWidget';
import { TestosteroneInsightsWidget } from '@/components/dashboard/TestosteroneInsightsWidget';
import { TodaysWorkoutWidget } from '@/components/dashboard/TodaysWorkoutWidget';
import { DietPreviewWidget } from '@/components/dashboard/DietPreviewWidget';
import { CommunityPreviewWidget } from '@/components/dashboard/CommunityPreviewWidget';

const QUICK_ACTIONS = [
  { emoji: '🤖', label: 'AI Coach', route: '/(modals)/ai-coach' },
  { emoji: '✅', label: 'Habits', route: '/(modals)/habit-tracker' },
  { emoji: '🩺', label: 'Checkup', route: '/(modals)/health-checkup' },
  { emoji: '🔔', label: 'Alerts', route: '/(modals)/notifications' },
];

export default function Dashboard() {
  const userGender = useUserStore((state: any) => state.userGender);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Global Header */}
        <LinearGradient colors={Colors.gradNight} style={[styles.header, { paddingTop: Math.max(insets.top + 16, 56) }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning 🌙</Text>
              <Text style={styles.headerName}>Priya Sharma</Text>
              <Badge label="Pro Member" variant="success" dot style={{ marginTop: 6 }} />
            </View>
            <TouchableOpacity>
              <Avatar name="Priya Sharma" size="lg" onlineIndicator />
            </TouchableOpacity>
          </View>

          {/* Core Daily Rings */}
          <View style={styles.ringsRow}>
            {[
              { label: 'Calories', value: '1,420', color: '#fff' },
              { label: 'Steps', value: '7,241', color: Colors.success },
              { label: 'Water', value: '5/8', color: Colors.info },
            ].map((r) => (
              <View key={r.label} style={styles.ringItem}>
                <Text style={[styles.ringValue, { color: r.color }]}>{r.value}</Text>
                <Text style={styles.ringLabel}>{r.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Top Quick Actions */}
          <View style={styles.quickRow}>
            {QUICK_ACTIONS.map((a) => (
              <TouchableOpacity
                key={a.label}
                style={styles.quickCard}
                onPress={() => router.push(a.route as any)}
              >
                <Text style={styles.quickEmoji}>{a.emoji}</Text>
                <Text style={styles.quickLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Conditional Gender-Specific Modulator */}
          {userGender === 'female' ? <CycleTrackerWidget /> : <TestosteroneInsightsWidget />}

          {/* Core Progress Tracking */}
          <View style={styles.statsRow}>
            <StatCard label="Weight Progress" value="72.3" unit="kg" trend="−0.6 kg this week" trendPositive icon="⚖️" style={{ flex: 1 }} />
            <StatCard label="Current Streak" value="14" unit="Days" trend="Personal best!" trendPositive icon="🔥" style={{ flex: 1 }} />
          </View>

          {/* Specialized Modules */}
          <TodaysWorkoutWidget />
          <DietPreviewWidget />
          
          {/* Telehealth Call-to-action */}
          <TouchableOpacity onPress={() => router.push('/(modals)/consultation')} activeOpacity={0.9}>
            <LinearGradient colors={Colors.gradSunrise} style={styles.consultBanner}>
              <Text style={styles.consultTitle}>Book a Consultation 👨‍⚕️</Text>
              <Text style={styles.consultSub}>Dr. Ananya is available today at 4:00 PM</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Lazy Social Snippet */}
          <CommunityPreviewWidget />
          
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  headerName: { fontSize: 24, fontWeight: FontWeight.extrabold, color: '#fff' },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 16 },
  ringItem: { alignItems: 'center', gap: 4 },
  ringValue: { fontSize: 18, fontWeight: FontWeight.bold },
  ringLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: FontWeight.medium, textTransform: 'uppercase' },
  content: { padding: 20, gap: 16 },
  quickRow: { flexDirection: 'row', gap: 10 },
  quickCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 20, paddingVertical: 14, alignItems: 'center', gap: 6, ...Shadow.sm,
  },
  quickEmoji: { fontSize: 22 },
  quickLabel: { fontSize: 11, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: 12 },
  consultBanner: { borderRadius: Radius['2xl'], padding: 20, gap: 6, ...Shadow.md },
  consultTitle: { fontSize: 16, fontWeight: FontWeight.bold, color: '#fff' },
  consultSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
});
