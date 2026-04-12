import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Timer } from 'lucide-react-native';

export interface CountdownTimerProps {
  initialMinutes: number;
  initialSeconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialMinutes, initialSeconds }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60 + initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <Timer color={Colors.warning} size={16} />
      <Text style={styles.text}>Offer ends in {mins}:{secs} min</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  text: {
    color: Colors.warning,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CountdownTimer;
