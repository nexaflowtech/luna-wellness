import React from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { Colors, Spacing, FontWeight, Typography, Radius } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { useUser } from '@/src/context/UserContext';
import { useDashboardData } from '@/src/hooks/useDashboardData';

import { CycleTrackerWidget } from '@/src/components/dashboard/CycleTrackerWidget';
import { TestosteroneInsightsWidget } from '@/src/components/dashboard/TestosteroneInsightsWidget';
import { DietPreviewWidget } from '@/src/components/dashboard/DietPreviewWidget';
import { TodaysWorkoutWidget } from '@/src/components/dashboard/TodaysWorkoutWidget';
import { Avatar } from '@/src/components/atoms/Avatar';
import { Card } from '@/src/components/molecules/Card';

export default function HomeDashboardRoute() {
  const { user } = useAuth();
  const { profile } = useUser();
  const { cycle, hormones, diet, workout, goals, isLoading, error } = useDashboardData();

  const firstName = profile?.displayName?.split(' ')[0] ?? user?.displayName?.split(' ')[0] ?? 'there';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Today&apos;s wellness dashboard</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Avatar
              size="md"
              uri={user?.photoURL ?? undefined}
              name={firstName}
            />
          </TouchableOpacity>
        </View>

        {goals.goals.length > 0 && (
          <View style={styles.goalRow}>
            {goals.goals.slice(0, 3).map((g) => (
              <View key={g} style={styles.goalChip}>
                <Text style={styles.goalChipText}>{g}</Text>
              </View>
            ))}
          </View>
        )}

        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        <Card style={styles.scoreCard} onPress={() => router.push('/(secondary)/hormone-insights')}>
          <View style={styles.scoreInner}>
            <LinearGradient colors={Colors.gradPrimary} style={styles.scoreBadge}>
              <Text style={styles.scoreNumber}>{hormones.score}</Text>
              <Text style={styles.scoreUnit}>/100</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.scoreTitle}>Risk Score</Text>
              <Text style={styles.scoreSub}>
                {hormones.label} · {hormones.trend}
              </Text>
              <Text style={styles.scoreCta}>Open hormone insights</Text>
            </View>
          </View>
        </Card>

        <View style={styles.quickActionsRow}>
          <Card style={styles.quickActionCard} onPress={() => router.push('/(secondary)/ai-coach')}>
            <Text style={styles.quickActionTitle}>AI Coach</Text>
          </Card>
          <Card style={styles.quickActionCard} onPress={() => router.push('/(secondary)/doctor-booking')}>
            <Text style={styles.quickActionTitle}>Book Consultation</Text>
          </Card>
          <Card style={styles.quickActionCard} onPress={() => router.push('/(secondary)/lab-tests')}>
            <Text style={styles.quickActionTitle}>Health Test</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Today Workout</Text>
        <TodaysWorkoutWidget data={workout} />

        <Text style={styles.sectionTitle}>Today Meal Plan</Text>
        <DietPreviewWidget data={diet} />

        <Text style={styles.sectionTitle}>Cycle Tracker</Text>
        <CycleTrackerWidget data={cycle} />

        <Text style={styles.sectionTitle}>Habit Tracker</Text>
        <Card onPress={() => router.push('/(modals)/habit-tracker' as any)}>
          <Text style={styles.progressText}>Track hydration, sleep and daily consistency streaks.</Text>
        </Card>

        <Text style={styles.sectionTitle}>Progress Overview</Text>
        <Card onPress={() => router.push('/(secondary)/progress')}>
          <Text style={styles.progressText}>Weight, cycle consistency, workout completion and diet adherence charts.</Text>
        </Card>

        <Text style={styles.sectionTitle}>Community Feed</Text>
        <Card onPress={() => router.push('/(tabs)/community')}>
          <Text style={styles.progressText}>See latest posts, comments, likes and wellness challenges.</Text>
        </Card>

        <Text style={styles.sectionTitle}>Hormone Insights</Text>
        <TestosteroneInsightsWidget data={hormones} />

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, gap: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  greeting: { ...Typography.sm, color: Colors.textMuted, fontWeight: FontWeight.medium },
  name: { ...Typography['2xl'], color: Colors.text, fontWeight: FontWeight.extrabold },
  goalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goalChip: { backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  goalChipText: { fontSize: 12, fontWeight: FontWeight.semibold, color: Colors.primary },
  scoreCard: { gap: 0 },
  scoreInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  scoreBadge: { width: 72, height: 72, borderRadius: Radius['2xl'], alignItems: 'center', justifyContent: 'center' },
  scoreNumber: { fontSize: 26, fontWeight: FontWeight.extrabold, color: '#fff', lineHeight: 28 },
  scoreUnit: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: FontWeight.semibold },
  scoreTitle: { fontSize: 15, fontWeight: FontWeight.bold, color: Colors.text },
  scoreSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  scoreCta: { fontSize: 12, color: Colors.primary, fontWeight: FontWeight.semibold, marginTop: 6 },
  sectionTitle: { fontSize: 13, fontWeight: FontWeight.bold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 },
  errorCard: { backgroundColor: Colors.errorLight },
  errorText: { fontSize: 13, color: Colors.error },
  quickActionsRow: { flexDirection: 'row', gap: 8 },
  quickActionCard: { flex: 1, alignItems: 'center' },
  quickActionTitle: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.primary, textAlign: 'center' },
  progressText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});
