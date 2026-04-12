import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface SummaryCardProps {
  children: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ children }) => {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#181b27',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginVertical: 16,
  },
});

export default SummaryCard;
