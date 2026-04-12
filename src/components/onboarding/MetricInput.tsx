import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface MetricInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit: string;
  placeholder?: string;
}

export const MetricInput: React.FC<MetricInputProps> = ({ label, value, onChangeText, unit, placeholder }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder={placeholder || '00'}
          placeholderTextColor="#a0a0a0"
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181b27',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    borderWidth: 2,
    borderColor: '#e4bdc3',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b7004e',
  },
  unit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5b3f44',
    marginLeft: 8,
  },
});

export default MetricInput;
