import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (val: number) => void;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, min, max, onChange, highlight }) => {
  const pct = ((value - min) / (max - min)) * 100;
  
  return (
    <View style={[styles.card, highlight && styles.cardHighlight]}>
      <Text style={[styles.label, highlight && styles.labelHighlight]}>{label}</Text>
      
      <View style={styles.valueRow}>
        <Text style={[styles.valueText, highlight && styles.valueHighlight]}>{value}</Text>
        <Text style={styles.unitText}> {unit}</Text>
      </View>

      <View style={styles.track}>
        <LinearGradient
          colors={[Colors.primary, Colors.accent]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${pct}%` }]}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={() => onChange(Math.max(min, value - 1))}>
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnPlus]} onPress={() => onChange(Math.min(max, value + 1))}>
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          />
          <Text style={[styles.btnText, { color: '#fff' }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardHighlight: {
    backgroundColor: 'rgba(110,231,183,0.08)',
    borderColor: '#6EE7B7',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelHighlight: {
    color: '#6EE7B7',
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  valueText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  valueHighlight: {
    color: '#6EE7B7',
  },
  track: {
    height: 5,
    borderRadius: 5,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
    marginVertical: 12,
  },
  fill: { height: '100%', borderRadius: 5 },
  controls: { flexDirection: 'row', gap: 8 },
  btn: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  btnPlus: { backgroundColor: '#818CF8', borderColor: 'transparent' },
  btnText: {
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
  },
});

export default MetricCard;
