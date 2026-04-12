import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import { Activity } from 'lucide-react-native';

export interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUri: string;
  bmiValue: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, avatarUri, bmiValue }) => {
  return (
    <View style={styles.container}>
      <View style={styles.userRow}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <View style={styles.bmiCard}>
        <View style={styles.bmiLeft}>
          <Activity color={Colors.accent} size={20} />
          <Text style={styles.bmiTitle}>Current BMI</Text>
        </View>
        <Text style={styles.bmiValue}>{bmiValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  bmiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#181b27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  bmiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bmiTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  bmiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.accent,
  },
});

export default ProfileHeader;
