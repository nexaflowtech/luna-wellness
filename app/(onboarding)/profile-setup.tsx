import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Activity, Calendar, Ruler, Baby, LineChart, Leaf, Dumbbell, Heart } from 'lucide-react-native';
import { SelectionCard } from '@/src/components/onboarding/SelectionCard';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';

const FEMALE_GOALS = [
  { id: 'pcos', title: 'PCOD / PCOS', desc: 'Manage symptoms and restore hormonal balance', icon: Activity, recommended: true },
  { id: 'cycle', title: 'Cycle Regulation', desc: 'Sync with your natural rhythm', icon: Calendar, recommended: true },
  { id: 'weight', title: 'Weight Loss', desc: 'Sustainable health-focused goals', icon: Ruler, recommended: false },
  { id: 'thyroid', title: 'Thyroid', desc: 'Optimize energy and metabolism', icon: Activity, recommended: false },
  { id: 'post', title: 'Post-pregnancy recovery', desc: 'Gentle healing for new mothers', icon: Baby, recommended: false },
  { id: 'hormone', title: 'Hormone balance', desc: 'Regulate endocrine health', icon: LineChart, recommended: false },
  { id: 'fertility', title: 'Fertility support', desc: '', icon: Leaf, recommended: false },
];

const MALE_GOALS = [
  { id: 'pcos', title: 'PCOD / Hormonal Balance', desc: 'Manage hormonal imbalance and improve metabolic stability', icon: Activity, recommended: true },
  { id: 'weight', title: 'Weight Loss', desc: 'Reduce fat and improve metabolic health', icon: Ruler, recommended: true },
  { id: 'strength', title: 'Strength Gain', desc: 'Build lean muscle and improve stamina', icon: Dumbbell, recommended: true },
  { id: 'thyroid', title: 'Thyroid', desc: 'Support metabolism and hormone balance', icon: Activity, recommended: false },
  { id: 'heart', title: 'Heart Health', desc: 'Improve cardio endurance and recovery', icon: Heart, recommended: false },
  { id: 'stress', title: 'Stress Management', desc: 'Lower stress and improve sleep quality', icon: LineChart, recommended: false },
];

const OTHER_GOALS = [
  { id: 'pcos', title: 'PCOD / PCOS', desc: 'Hormone-focused care and symptom support', icon: Activity, recommended: true },
  { id: 'hormone', title: 'Hormone Balance', desc: 'Build personalized endocrine support', icon: Activity, recommended: true },
  { id: 'weight', title: 'Weight Management', desc: 'Sustainable fat loss and body recomposition', icon: Ruler, recommended: true },
  { id: 'cycle', title: 'Cycle & Rhythm Support', desc: 'Track and improve cycle consistency', icon: Calendar, recommended: false },
  { id: 'thyroid', title: 'Thyroid Care', desc: 'Support energy and metabolic function', icon: LineChart, recommended: false },
  { id: 'wellness', title: 'General Wellness', desc: 'Daily habits for long-term health', icon: Leaf, recommended: false },
];

type Gender = 'female' | 'male' | 'other';

export default function ProfileSetupScreen() {
  const [gender, setGender] = useState<Gender>('female');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goalsByGender = useMemo(() => {
    if (gender === 'male') return MALE_GOALS;
    if (gender === 'other') return OTHER_GOALS;
    return FEMALE_GOALS;
  }, [gender]);

  const onSelectGender = (nextGender: Gender) => {
    setGender(nextGender);
    setSelectedGoals([]);
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  const handleContinue = () => {
    if (selectedGoals.length === 0) {
      Alert.alert('Select goals', 'Please choose at least one goal to continue.');
      return;
    }
    const goalsParam = encodeURIComponent(selectedGoals.join(','));
    const needsAdaptive = selectedGoals.some(g => ['pcos', 'thyroid', 'fertility', 'cycle'].includes(g));
    
    if (needsAdaptive) {
      router.push(`/(onboarding)/adaptive-questions?gender=${gender}&goals=${goalsParam}` as any);
    } else {
      router.push(`/(onboarding)/profile-details?gender=${gender}&goals=${goalsParam}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#181b27" size={24} />
        </TouchableOpacity>
        <Text style={styles.logo}>Luna</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressIndicator currentStep={2} totalSteps={5} />

        <View style={styles.titleWrap}>
          <Text style={styles.title}>What brings you to Luna?</Text>
          <Text style={styles.subtitle}>Select your primary health focus so we can tailor your wellness journey.</Text>
        </View>

        <View style={styles.segmentWrap}>
          {(['female', 'male', 'other'] as const).map((g) => {
            const isActive = gender === g;
            return (
              <TouchableOpacity key={g} onPress={() => onSelectGender(g)} style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}>
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{g}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.recommendedLabel}>Recommended for you</Text>
        {goalsByGender.map((goal, index) => {
          const IconComp = goal.icon;
          const isSelected = selectedGoals.includes(goal.id);
          const showOtherDivider = !goal.recommended && (index === 0 || goalsByGender[index - 1].recommended);

          return (
            <React.Fragment key={goal.id}>
              {showOtherDivider ? (
                <View style={styles.dividerWrap}>
                  <Text style={styles.dividerLabel}>Other Focus Areas</Text>
                </View>
              ) : null}

              <SelectionCard
                title={goal.title}
                description={goal.desc}
                icon={<IconComp color={isSelected ? '#ffffff' : '#b7004e'} size={24} strokeWidth={1.5} />}
                isSelected={isSelected}
                isRecommended={goal.recommended}
                onToggle={() => toggleGoal(goal.id)}
              />
            </React.Fragment>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={[styles.goalCount, { opacity: selectedGoals.length > 0 ? 1 : 0 }]}>
          {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
        </Text>
        <TouchableOpacity activeOpacity={0.85} onPress={handleContinue} style={styles.continueBtn}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#faf8ff' },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 14, marginBottom: 8 },
  backBtn: {
    width: 40,
    height: 40,
    marginLeft: -8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  logo: { flex: 1, textAlign: 'center', color: '#b7004e', fontWeight: '800', fontSize: 20, marginLeft: -32 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 160, paddingTop: 16 },
  titleWrap: { alignItems: 'center', marginBottom: 28, marginTop: 4 },
  title: { fontSize: 30, fontWeight: '800', color: '#181b27', textAlign: 'center', lineHeight: 36, marginBottom: 10 },
  subtitle: { color: '#5b3f44', fontSize: 15, fontWeight: '500', textAlign: 'center', paddingHorizontal: 10, lineHeight: 22 },
  segmentWrap: { width: '100%', marginBottom: 28, backgroundColor: '#f3f2ff', padding: 6, borderRadius: 999, flexDirection: 'row' },
  segmentBtn: { flex: 1, paddingVertical: 13, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  segmentBtnActive: { backgroundColor: '#b7004e' },
  segmentText: { fontWeight: '700', textTransform: 'capitalize', color: '#5b3f44' },
  segmentTextActive: { color: '#ffffff' },
  recommendedLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: 'rgba(183,0,78,0.7)',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  dividerWrap: {
    width: '100%',
    marginTop: 18,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(228,189,195,0.6)',
    paddingTop: 18,
  },
  dividerLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: 'rgba(91,63,68,0.45)',
    paddingHorizontal: 2,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    paddingTop: 20,
    backgroundColor: '#faf8ff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(228,189,195,0.4)',
  },
  goalCount: { fontSize: 13, fontWeight: '700', color: '#b7004e', marginBottom: 12, textAlign: 'center' },
  continueBtn: {
    width: '100%',
    backgroundColor: '#b7004e',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { color: '#ffffff', fontWeight: '800', fontSize: 17, textTransform: 'uppercase', letterSpacing: 0.8 },
});
