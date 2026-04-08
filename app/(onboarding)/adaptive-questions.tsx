import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Activity, Pill, Calendar } from 'lucide-react-native';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';

const OPTIONS_PCOS = [
  'Irregular or missing periods',
  'Weight resistance / gain',
  'Acne or excess hair growth',
  'Fatigue / brain fog',
  'No severe symptoms',
];

const OPTIONS_THYROID = [
  'Yes, Levothyroxine/Synthroid',
  'Yes, other medication',
  'No medication',
  'Unsure',
];

const OPTIONS_FERTILITY = [
  'Regular (26-32 days)',
  'Short (Under 25 days)',
  'Long / Irregular (Over 35 days)',
  'Amenorrhea (Missing periods)',
];

export default function AdaptiveQuestionsScreen() {
  const params = useLocalSearchParams<{ gender?: string; goals?: string }>();
  const gender = params.gender || 'female';
  const goalsArray = params.goals ? params.goals.split(',') : [];

  const needsPcos = goalsArray.includes('pcos');
  const needsThyroid = goalsArray.includes('thyroid');
  const needsCycle = goalsArray.includes('cycle') || goalsArray.includes('fertility');

  const [pcosAns, setPcosAns] = useState<string[]>([]);
  const [thyroidAns, setThyroidAns] = useState<string>('');
  const [cycleAns, setCycleAns] = useState<string>('');

  const handleNext = () => {
    // Only block if a required category wasn't answered
    if (needsPcos && pcosAns.length === 0) return;
    if (needsThyroid && !thyroidAns) return;
    if (needsCycle && !cycleAns) return;

    const adaptiveAnswers: Record<string, string> = {};
    if (needsPcos) adaptiveAnswers.pcosSymptoms = pcosAns.join(', ');
    if (needsThyroid) adaptiveAnswers.thyroidMedication = thyroidAns;
    if (needsCycle) adaptiveAnswers.cycleBaseline = cycleAns;

    const adaptiveParam = encodeURIComponent(JSON.stringify(adaptiveAnswers));
    router.push(`/(onboarding)/profile-details?gender=${gender}&goals=${params.goals}&adaptive=${adaptiveParam}` as any);
  };

  const isReady =
    (!needsPcos || pcosAns.length > 0) &&
    (!needsThyroid || thyroidAns !== '') &&
    (!needsCycle || cycleAns !== '');

  const togglePcos = (ans: string) => {
    setPcosAns((prev) =>
      prev.includes(ans) ? prev.filter((a) => a !== ans) : [...prev, ans]
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.85}>
          <ArrowLeft color="#181b27" size={20} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.logo}>Luna</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressIndicator currentStep={2} totalSteps={4} />

        <View style={styles.titleWrap}>
          <Text style={styles.title}>Let's refine your profile</Text>
          <Text style={styles.subtitle}>
            You selected goals that benefit from personalized scientific context.
          </Text>
        </View>

        {needsPcos && (
          <View style={styles.questionBlock}>
            <View style={styles.questionHeader}>
              <View style={[styles.iconWrap, { backgroundColor: '#ffd9df' }]}>
                <Activity size={18} color="#b7004e" />
              </View>
              <Text style={styles.questionTitle}>What are your primary PCOS symptoms?</Text>
            </View>
            <Text style={styles.helperText}>Select all that apply</Text>
            <View style={styles.optionsWrap}>
              {OPTIONS_PCOS.map((opt) => {
                const active = pcosAns.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.8}
                    style={[styles.optionBtn, active && styles.optionBtnActive]}
                    onPress={() => togglePcos(opt)}
                  >
                    <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                      {active && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {needsThyroid && (
          <View style={styles.questionBlock}>
            <View style={styles.questionHeader}>
              <View style={[styles.iconWrap, { backgroundColor: '#e2136422' }]}>
                <Pill size={18} color="#e21364" />
              </View>
              <Text style={styles.questionTitle}>Are you currently prescribed thyroid medication?</Text>
            </View>
            <View style={styles.optionsWrap}>
              {OPTIONS_THYROID.map((opt) => {
                const active = thyroidAns === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.8}
                    style={[styles.optionBtn, active && styles.optionBtnActive]}
                    onPress={() => setThyroidAns(opt)}
                  >
                    <View style={[styles.radioOuter, active && styles.radioOuterActive, { borderRadius: 99 }]}>
                      {active && <View style={[styles.radioInner, { borderRadius: 99 }]} />}
                    </View>
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {needsCycle && (
          <View style={styles.questionBlock}>
            <View style={styles.questionHeader}>
              <View style={[styles.iconWrap, { backgroundColor: '#fcdcd8' }]}>
                <Calendar size={18} color="#fc695d" />
              </View>
              <Text style={styles.questionTitle}>What is your current menstrual cycle baseline?</Text>
            </View>
            <View style={styles.optionsWrap}>
              {OPTIONS_FERTILITY.map((opt) => {
                const active = cycleAns === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.8}
                    style={[styles.optionBtn, active && styles.optionBtnActive]}
                    onPress={() => setCycleAns(opt)}
                  >
                    <View style={[styles.radioOuter, active && styles.radioOuterActive, { borderRadius: 99 }]}>
                      {active && <View style={[styles.radioInner, { borderRadius: 99 }]} />}
                    </View>
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={[styles.continueBtn, !isReady && { opacity: 0.5 }]}
          disabled={!isReady}
        >
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
  titleWrap: { alignItems: 'center', marginBottom: 32, marginTop: 4 },
  title: { fontSize: 28, fontWeight: '800', color: '#181b27', textAlign: 'center', lineHeight: 34, marginBottom: 10 },
  subtitle: { color: '#5b3f44', fontSize: 15, fontWeight: '500', textAlign: 'center', paddingHorizontal: 10, lineHeight: 22 },
  
  questionBlock: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#b7004e',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  questionTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: '#181b27', lineHeight: 22 },
  helperText: { fontSize: 13, color: '#8f6f74', marginBottom: 14, marginTop: -6, paddingLeft: 48, fontStyle: 'italic' },
  
  optionsWrap: { gap: 10 },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionBtnActive: {
    backgroundColor: '#fff0f2',
    borderColor: '#ffc0cb',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#caced6',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#b7004e' },
  radioInner: { width: 10, height: 10, borderRadius: 2, backgroundColor: '#b7004e' },
  optionText: { fontSize: 15, fontWeight: '600', color: '#4a4d55' },
  optionTextActive: { color: '#b7004e' },

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
