import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User2, Users, Sparkles, Check } from 'lucide-react-native';
// Reanimated removed for Expo Go compatibility
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { useOnboardingStore } from '@/src/store/onboardingStore';

export default function GenderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { gender: storeGender, setGender } = useOnboardingStore();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other' | null>(storeGender as any || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedGender) return;
    setIsLoading(true);

    if (user?.uid) {
      updateUserDoc(user.uid, {
        gender: selectedGender,
        onboardingStep: '/(onboarding)/profile-details',
      }).catch(e => console.log('Gender save error:', e));
    }

    setGender(selectedGender);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/(onboarding)/profile-details');
    }, 400);
  };

  return (
    <View style={styles.container}>
      {/* Progress Header (4 Steps) */}
      <View style={styles.progressHeader}>
        <View style={[styles.progressBar, styles.progressBarFilled]} />
        <View style={[styles.progressBar, styles.progressBarEmpty]} />
        <View style={[styles.progressBar, styles.progressBarEmpty]} />
        <View style={[styles.progressBar, styles.progressBarEmpty]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>Tell us about{'\n'}yourself</Text>
          <Text style={styles.subtitleText}>
            Biological sex influences how your body processes nutrients, regulates hormones, and responds to activity.
          </Text>
        </View>

        {/* Selection Grid */}
        <View style={styles.cardGrid}>
          <GenderCard
            title="Male"
            desc="Calibrated for male metabolic patterns"
            icon={<User2 color={selectedGender === 'male' ? '#006e2f' : '#006b5f'} size={28} />}
            isSelected={selectedGender === 'male'}
            onSelect={() => setSelectedGender('male')}
            delay={100}
            accentColor="#e5eeff"
          />
          <GenderCard
            title="Female"
            desc="Tailored to female-specific health cycles"
            icon={<User2 color={selectedGender === 'female' ? '#006e2f' : '#006b5f'} size={28} />}
            isSelected={selectedGender === 'female'}
            onSelect={() => setSelectedGender('female')}
            delay={200}
            accentColor="#f8f9ff"
          />
          <GenderCard
            title="Different"
            desc="Inclusive approach to individualized wellness"
            icon={<Users color={selectedGender === 'other' ? '#006e2f' : '#006b5f'} size={28} />}
            isSelected={selectedGender === 'other'}
            onSelect={() => setSelectedGender('other')}
            delay={300}
            accentColor="#eff4ff"
          />
        </View>

        {/* AI Recommendation Panel */}
        <View style={styles.aiPanel}>
          <View style={styles.aiPanelRow}>
            <View style={styles.aiIconBox}>
              <Sparkles color="#005ac2" size={20} />
            </View>
            <View style={styles.aiTextBox}>
              <Text style={styles.aiLabel}>AI Recommendation</Text>
              <Text style={styles.aiBody}>
                Accurate biological data allows our AI to predict daily energy peaks 40% more accurately for your specific profile.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueBtn, !selectedGender && styles.continueBtnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.9}
          disabled={!selectedGender || isLoading}
        >
          <LinearGradient
            colors={['#006e2f', '#006b5f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueBtnGradient}
          >
            <Text style={styles.continueBtnText}>
              {isLoading ? 'Calibrating AI...' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface GenderCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
  accentColor: string;
}

function GenderCard({ title, desc, icon, isSelected, onSelect, delay, accentColor }: GenderCardProps) {
  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onSelect}
        style={[styles.card, isSelected ? styles.cardSelected : styles.cardDefault]}
      >
        <View style={[styles.cardIcon, { backgroundColor: isSelected ? '#eef4ff' : accentColor }]}>
          {icon}
        </View>
        <View style={styles.cardTextBox}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDesc}>{desc}</Text>
        </View>
        <View style={[styles.cardCheck, isSelected ? styles.cardCheckSelected : styles.cardCheckDefault]}>
          {isSelected && <Check color="white" size={14} strokeWidth={4} />}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9ff' },
  progressHeader: { flexDirection: 'row', gap: 8, paddingHorizontal: 32, paddingTop: 64, paddingBottom: 24 },
  progressBar: { flex: 1, height: 4, borderRadius: 99 },
  progressBarFilled: { backgroundColor: '#006e2f' },
  progressBarEmpty: { backgroundColor: '#d3e4fe' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 32, paddingBottom: 40 },
  headerSection: { marginBottom: 40, marginTop: 16 },
  titleText: { fontSize: 40, fontWeight: '800', color: '#0b1c30', letterSpacing: -1, lineHeight: 48 },
  subtitleText: { fontSize: 16, color: '#3d4a3d', lineHeight: 26, fontWeight: '500', marginTop: 16 },
  cardGrid: { flexDirection: 'column', gap: 16, marginBottom: 48 },
  cardWrapper: {},
  card: { flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 32, borderWidth: 2 },
  cardSelected: { borderColor: '#006e2f', backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardDefault: { borderColor: 'transparent', backgroundColor: '#ffffff' },
  cardIcon: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  cardTextBox: { flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#0b1c30', letterSpacing: -0.5, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#3d4a3d', fontWeight: '500', lineHeight: 18 },
  cardCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  cardCheckSelected: { backgroundColor: '#006e2f', borderColor: '#006e2f' },
  cardCheckDefault: { borderColor: '#bccbb9' },
  aiPanel: { backgroundColor: '#eff4ff', padding: 24, borderRadius: 32, marginBottom: 8 },
  aiPanelRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  aiIconBox: { padding: 12, backgroundColor: '#dce9ff', borderRadius: 16 },
  aiTextBox: { flex: 1 },
  aiLabel: { fontSize: 10, fontWeight: '700', color: '#005ac2', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  aiBody: { fontSize: 14, color: '#3d4a3d', lineHeight: 22, fontWeight: '700' },
  actionBar: { padding: 32, backgroundColor: '#f8f9ff', flexDirection: 'row', gap: 16 },
  backBtn: { flex: 1, paddingVertical: 20, borderRadius: 24, backgroundColor: '#d3e4fe', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { color: '#006e2f', fontWeight: '700', fontSize: 16 },
  continueBtn: { flex: 2, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnGradient: { width: '100%', paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  continueBtnText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: -0.3 },
});
