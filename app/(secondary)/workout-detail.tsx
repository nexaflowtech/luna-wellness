// Inlined from deleted app/(app)/(workout)/player.tsx
// The legacy (app)/ group has been removed; this screen now lives directly in (secondary)/.
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, FontWeight } from '@/constants/theme';
import { ProgressBar } from '@/components/atoms/ProgressBar';

export default function WorkoutPlayerStub() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Full Body Strength</Text>
      <Text style={styles.subtext}>Video Player loading via Expo AV...</Text>

      <ProgressBar value={25} style={{ marginVertical: 30 }} />

      <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
        <Text style={styles.btnLabel}>End Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 30, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: FontWeight.bold, color: Colors.text, textAlign: 'center' },
  subtext: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 10 },
  btn: { backgroundColor: Colors.error, padding: 14, borderRadius: 12, alignItems: 'center' },
  btnLabel: { color: '#fff', fontWeight: FontWeight.bold, fontSize: 16 },
});
