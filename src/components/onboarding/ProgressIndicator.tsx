import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i === currentStep - 1;
          const isCompleted = i < currentStep - 1;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                isActive ? styles.dotActive : isCompleted ? styles.dotDone : styles.dotPending,
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.label}>Step {currentStep} of {totalSteps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  row: { flex: 1, flexDirection: 'row' },
  dot: { height: 8, borderRadius: 999, marginRight: 4 },
  dotActive: { backgroundColor: '#b7004e', flex: 1 },
  dotDone: { backgroundColor: '#e497aa', width: 16 },
  dotPending: { backgroundColor: '#e6e7f8', width: 16 },
  label: { fontSize: 10, fontWeight: '700', color: '#8f6f74', textTransform: 'uppercase', letterSpacing: 1.2 },
});

export default ProgressIndicator;
