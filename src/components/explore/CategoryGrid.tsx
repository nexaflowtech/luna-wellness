import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';

export interface CategoryItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color?: string;
}

export interface CategoryGridProps {
  categories: CategoryItem[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <View style={styles.grid}>
      {categories.map((cat) => (
        <TouchableOpacity style={styles.card} key={cat.id} activeOpacity={0.8}>
          <View style={[styles.iconWrap, { backgroundColor: cat.color || 'rgba(124, 58, 237, 0.1)' }]}>
            {cat.icon}
          </View>
          <Text style={styles.title}>{cat.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#181b27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
});

export default CategoryGrid;
