import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface FeatureItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export interface FeatureGridProps {
  features: FeatureItem[];
  onFeaturePress?: (id: string) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ features, onFeaturePress }) => {
  return (
    <View style={styles.gridContainer}>
      {features.map((feature) => (
        <TouchableOpacity 
          key={feature.id} 
          style={styles.gridItem}
          activeOpacity={0.8}
          onPress={() => onFeaturePress && onFeaturePress(feature.id)}
        >
          <View style={styles.iconWrap}>{feature.icon}</View>
          <Text style={styles.title}>{feature.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '47%', // 2 columns approx
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#181b27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f9fafb',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});

export default FeatureGrid;
