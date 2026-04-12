import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SettingsList, SettingsItem } from '@/components/profile/SettingsList';
import { LegalLinks } from '@/components/profile/LegalLinks';
import { useUser } from '@/src/context/UserContext';
import { logoutUser } from '@/src/services/authService';
import { router } from 'expo-router';
import { Target, Droplets, Apple, PauseCircle, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { profile } = useUser();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/(onboarding)/login');
    } catch (e) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const accountSettings: SettingsItem[] = [
    { 
      id: 'active_plan', 
      title: 'Active Plan', 
      icon: <Target color={Colors.primary} size={22} />,
      onPress: () => console.log('Active Plan clicked')
    },
    { 
      id: 'blood_tests', 
      title: 'Blood Tests', 
      icon: <Droplets color={Colors.accent} size={22} /> 
    },
    { 
      id: 'dietician', 
      title: 'Dietician Connect', 
      icon: <Apple color={Colors.success} size={22} /> 
    },
    { 
      id: 'pause_plan', 
      title: 'Pause Plan', 
      icon: <PauseCircle color={Colors.warning} size={22} /> 
    },
  ];

  const systemSettings: SettingsItem[] = [
    { 
      id: 'logout', 
      title: 'Sign Out', 
      icon: <LogOut color="#EF4444" size={22} />,
      onPress: handleLogout,
      destructive: true
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: Colors.background }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.screenTitle}>My Profile</Text>

        <ProfileHeader 
          name={profile?.displayName ?? 'Sarah Connor'}
          email={profile?.email ?? 'sarah.c@example.com'}
          avatarUri={profile?.photoURL ?? 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'}
          bmiValue="22.4"
        />

        <Text style={styles.sectionTitle}>Account & Services</Text>
        <SettingsList items={accountSettings} />

        <Text style={styles.sectionTitle}>System</Text>
        <SettingsList items={systemSettings} />

        <LegalLinks />
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 8,
  },
});
