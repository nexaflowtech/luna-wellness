import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export interface SettingsItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}

export interface SettingsListProps {
  items: SettingsItem[];
}

export const SettingsList: React.FC<SettingsListProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <TouchableOpacity 
            style={styles.row} 
            activeOpacity={0.7}
            onPress={item.onPress}
          >
            <View style={styles.leftGroup}>
              {item.icon}
              <Text style={[styles.title, item.destructive && styles.destructiveText]}>
                {item.title}
              </Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>
          {index < items.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  destructiveText: {
    color: '#EF4444', // Tailwind red-500
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 48, // offset to align with text
  },
});

export default SettingsList;
