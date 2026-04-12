import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const LegalLinks: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity><Text style={styles.link}>Refund Policy</Text></TouchableOpacity>
      <Text style={styles.dot}>•</Text>
      <TouchableOpacity><Text style={styles.link}>Terms</Text></TouchableOpacity>
      <Text style={styles.dot}>•</Text>
      <TouchableOpacity><Text style={styles.link}>Privacy</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  link: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});

export default LegalLinks;
