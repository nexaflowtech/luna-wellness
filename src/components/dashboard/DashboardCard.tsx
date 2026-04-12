import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export interface DashboardCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#181b27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f9fafb',
  },
});

export default DashboardCard;
