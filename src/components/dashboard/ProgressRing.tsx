import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ progress, size = 80, label }) => {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth }]}>
      <View style={[styles.inner, { width: size - strokeWidth * 2, height: size - strokeWidth * 2, borderRadius: (size - strokeWidth * 2) / 2 }]}>
        <Text style={styles.text}>{Math.round(progress)}%</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
      {/* 
        This is a rudimentary shim for a native ProgressRing since react-native-svg 
        is unverified. It provides a visual ring and the text metric centered inside.
      */}
      <View style={[StyleSheet.absoluteFillObject, styles.overlay, { borderRadius: size / 2, borderLeftColor: Colors.primary, borderTopColor: Colors.primary, borderRightColor: progress > 50 ? Colors.primary : 'transparent', borderBottomColor: progress > 75 ? Colors.primary : 'transparent', borderWidth: strokeWidth, transform: [{ rotate: '45deg' }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inner: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ProgressRing;
