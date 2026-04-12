import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export interface ChecklistItemProps {
  text: string;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <CheckCircle2 color={Colors.success} size={20} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#181b27',
    fontWeight: '500',
  },
});

export default ChecklistItem;
