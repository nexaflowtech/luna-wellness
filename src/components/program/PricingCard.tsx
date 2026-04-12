import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface PricingCardProps {
  children: React.ReactNode;
}

export const PricingCard: React.FC<PricingCardProps> = ({ children }) => {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#b7004e', // Using primary brand as border directly for highlights, or just a generic accent
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    marginVertical: 20,
  },
});

export default PricingCard;
