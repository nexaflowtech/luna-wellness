import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontWeight } from '@/src/constants/theme';
import { useUser } from '@/src/context/UserContext';
import { logoutUser } from '@/src/services/authService';
import { Card } from '@/src/components/molecules/Card';

const ACTIONS = [
  { label: 'Cycle Tracking', route: '/(secondary)/cycle-tracking' },
  { label: 'Progress Tracker', route: '/(secondary)/progress' },
  { label: 'Subscription Plans', route: '/(secondary)/subscriptions' },
  { label: 'AI Coach Chat', route: '/(secondary)/ai-coach' },
  { label: 'Doctor Booking', route: '/(secondary)/doctor-booking' },
  { label: 'Lab Tests', route: '/(secondary)/lab-tests' },
];

export default function ProfileScreen() {
  const { profile } = useUser();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#2d303d', '#b7004e']} style={styles.header}>
        <Text style={styles.title}>{profile?.displayName ?? 'Luna Member'}</Text>
        <Text style={styles.subtitle}>{profile?.email ?? 'Wellness profile'}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {ACTIONS.map((action) => (
          <TouchableOpacity key={action.label} onPress={() => router.push(action.route as any)}>
            <Card>
              <Text style={{ fontSize: 15, color: '#181b27', fontWeight: FontWeight.semibold }}>{action.label}</Text>
            </Card>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await logoutUser();
            router.replace('/(onboarding)/login');
          }}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  title: { fontSize: 24, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  content: { padding: 20, gap: 10, paddingBottom: 40 },
  logoutBtn: { marginTop: 8, backgroundColor: '#ffdad6', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: '#93000a', fontWeight: FontWeight.bold },
});
