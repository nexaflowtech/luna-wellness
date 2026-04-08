import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar } from '@/components/atoms/Avatar';

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradPrimary} style={styles.header}>
        <Text style={styles.step}>STEP 1 OF 3</Text>
        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar picker */}
        <View style={styles.avatarSection}>
          <Avatar name={name || 'You'} size="xl" />
          <TouchableOpacity style={styles.avatarEditBtn}>
            <Text style={styles.avatarEditText}>+ Add Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Input
            label="Full name"
            placeholder="e.g. Priya Sharma"
            value={name}
            onChangeText={setName}
          />
          <Input label="Date of birth" placeholder="DD / MM / YYYY" keyboardType="number-pad" />
          <Input label="Phone number" placeholder="+91 98765 43210" keyboardType="phone-pad" />

          {/* Gender selector */}
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderGrid}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setSelectedGender(g)}
                  style={[
                    styles.genderChip,
                    selectedGender === g && styles.genderChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.genderChipText,
                      selectedGender === g && { color: '#fff' },
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button label="Save & Continue" onPress={() => router.push('/(setup)/health-assessment')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 28,
    gap: 6,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  step: { fontSize: 11, fontWeight: FontWeight.bold, color: 'rgba(255,255,255,0.55)', letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.7)' },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  avatarSection: { alignItems: 'center', paddingTop: 24, gap: 10 },
  avatarEditBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
  },
  avatarEditText: { fontSize: 13, color: Colors.primary, fontWeight: FontWeight.semibold },
  card: { backgroundColor: Colors.card, borderRadius: 24, padding: 24, gap: 16, ...Shadow.sm },
  label: { fontSize: 13, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  genderGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  genderChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  genderChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genderChipText: { fontSize: 13, fontWeight: FontWeight.medium, color: Colors.textSecondary },
});
