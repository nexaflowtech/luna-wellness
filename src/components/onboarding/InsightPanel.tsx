import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface InsightPanelItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface InsightPanelProps {
  title: string;
  items: InsightPanelItem[];
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ title, items }) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>{title}</Text>
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.rowLeft}>
              {item.icon && <View style={styles.iconWrap}>{item.icon}</View>}
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
    paddingBottom: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  rowRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default InsightPanel;
