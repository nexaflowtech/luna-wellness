import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';

export interface MedicalCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  alert?: string;
  style?: ViewStyle;
}

export const MedicalCard: React.FC<MedicalCardProps> = ({ title, subtitle, icon, alert, style }) => {
  return (
    <TouchableOpacity style={[styles.card, style]} activeOpacity={0.8}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {alert && (
          <View style={styles.alertWrap}>
            <Text style={styles.alertText}>{alert}</Text>
          </View>
        )}
      </View>
      <View style={styles.actionWrap}>
        <ChevronRight color={Colors.primary} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#b7004e', // Primary hue
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(183, 0, 78, 0.08)', // Colors.primary light
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  alertWrap: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // Warning color
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  alertText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warning,
  },
  actionWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MedicalCard;
