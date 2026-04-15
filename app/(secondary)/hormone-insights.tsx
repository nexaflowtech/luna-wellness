import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, Activity, FileText, Upload, Brain, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Stage = 'quiz' | 'score' | 'blood' | 'upload' | 'analysis' | 'plan';

const STAGES: { key: Stage; label: string }[] = [
  { key: 'quiz', label: 'Risk Quiz' },
  { key: 'score', label: 'AI Score' },
  { key: 'blood', label: 'Recommendations' },
  { key: 'upload', label: 'Upload Report' },
  { key: 'analysis', label: 'AI Analysis' },
  { key: 'plan', label: 'Action Plan' },
];

const METRICS = [
  { label: 'Estrogen', value: 'Normal', color: '#22C55E', bar: 0.72 },
  { label: 'Progesterone', value: 'Low', color: '#EAB308', bar: 0.38 },
  { label: 'Testosterone', value: 'Elevated', color: '#F472B6', bar: 0.82 },
  { label: 'Cortisol', value: 'High', color: '#EF4444', bar: 0.88 },
  { label: 'Insulin', value: 'Borderline', color: '#EAB308', bar: 0.55 },
];

export default function HormoneInsightsScreen() {
  const [stage, setStage] = useState<Stage>('quiz');
  const [quizAnswer, setQuizAnswer] = useState('high');
  const [reportName, setReportName] = useState('');

  const stageIndex = STAGES.findIndex(s => s.key === stage);

  const aiScore = useMemo(() => {
    if (quizAnswer === 'low') return 82;
    if (quizAnswer === 'moderate') return 68;
    return 54;
  }, [quizAnswer]);

  const scoreColor = aiScore >= 75 ? '#22C55E' : aiScore >= 60 ? '#EAB308' : '#EF4444';
  const riskLabel = aiScore >= 75 ? 'Low Risk' : aiScore >= 60 ? 'Moderate Risk' : 'High Risk';

  const goNext = () => {
    const next = STAGES[stageIndex + 1]?.key;
    if (next) setStage(next);
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-[22px] font-black">Hormone Insights</Text>
          <Text className="text-textSecondary text-[13px]">Smart health checkup flow</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
          <Activity color="#7C3AED" size={20} />
        </View>
      </View>

      {/* Progress Steps */}
      <View className="px-5 py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {STAGES.map((s, i) => (
            <View key={s.key} className="flex-row items-center gap-2">
              <View
                className="px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: i <= stageIndex ? '#7C3AED20' : 'rgba(255,255,255,0.04)',
                  borderColor: i <= stageIndex ? '#7C3AED60' : 'rgba(255,255,255,0.08)',
                }}
              >
                <Text className="text-[11px] font-bold" style={{ color: i <= stageIndex ? '#7C3AED' : '#8A8A93' }}>
                  {s.label}
                </Text>
              </View>
              {i < STAGES.length - 1 && <ChevronRight color="#333" size={14} />}
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 20 }} showsVerticalScrollIndicator={false}>

        {/* Hormone Metric Cards — always visible */}
        <View>
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Hormone Overview</Text>
          <View className="bg-surface border border-white/5 rounded-[28px] p-6 gap-5">
            {METRICS.map(m => (
              <View key={m.label}>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-white text-[15px] font-bold">{m.label}</Text>
                  <Text className="text-[13px] font-extrabold" style={{ color: m.color }}>{m.value}</Text>
                </View>
                <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <View className="h-full rounded-full" style={{ width: `${m.bar * 100}%`, backgroundColor: m.color }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Stage: Quiz */}
        {stage === 'quiz' && (
          <View className="bg-surface border border-white/5 rounded-[28px] p-6 gap-4">
            <Text className="text-textSecondary text-[12px] font-bold uppercase tracking-widest">Step 1 — Risk Assessment</Text>
            <Text className="text-white text-[20px] font-black leading-snug">How frequent are fatigue and cycle irregularities?</Text>
            <View className="gap-3">
              {['low', 'moderate', 'high'].map(v => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setQuizAnswer(v)}
                  className="rounded-[20px] px-5 py-4 border flex-row items-center justify-between"
                  style={{
                    backgroundColor: quizAnswer === v ? '#7C3AED20' : 'rgba(255,255,255,0.04)',
                    borderColor: quizAnswer === v ? '#7C3AED60' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <Text className="capitalize text-white text-[15px] font-bold">{v} frequency</Text>
                  {quizAnswer === v && <CheckCircle2 color="#7C3AED" size={20} />}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={goNext} className="mt-2">
              <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-full py-4 items-center">
                <Text className="text-white font-black text-[16px]">Generate AI Score</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Stage: Score */}
        {stage === 'score' && (
          <View className="bg-surface border border-white/5 rounded-[28px] p-6 gap-5">
            <Text className="text-textSecondary text-[12px] font-bold uppercase tracking-widest">Step 2 — Your AI Score</Text>
            <View className="items-center py-4">
              <View className="relative w-36 h-36 items-center justify-center">
                <View className="absolute inset-0 rounded-full border-4 bg-transparent" style={{ borderColor: `${scoreColor}20` }} />
                <Text className="text-[44px] font-black" style={{ color: scoreColor }}>{aiScore}</Text>
                <Text className="text-textSecondary text-[12px] font-bold">/ 100</Text>
              </View>
              <View
                className="mt-4 px-5 py-2 rounded-full"
                style={{ backgroundColor: `${scoreColor}15`, borderWidth: 1, borderColor: `${scoreColor}40` }}
              >
                <Text className="font-extrabold text-[14px]" style={{ color: scoreColor }}>{riskLabel}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={goNext}>
              <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-full py-4 items-center">
                <Text className="text-white font-black text-[16px]">View Blood Test Recommendations</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Stage: Blood */}
        {stage === 'blood' && (
          <View className="bg-surface border border-white/5 rounded-[28px] p-6 gap-4">
            <Text className="text-textSecondary text-[12px] font-bold uppercase tracking-widest">Step 3 — Recommended Tests</Text>
            <Text className="text-white text-[20px] font-black">Blood Panel Recommendations</Text>
            {['Thyroid panel (TSH, T3, T4)', 'Fasting insulin and glucose', 'LH/FSH ratio and prolactin'].map((item, i) => (
              <View key={i} className="flex-row items-center gap-4 bg-white/5 rounded-[16px] p-4">
                <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
                  <FileText color="#7C3AED" size={16} />
                </View>
                <Text className="text-white text-[14px] font-semibold flex-1">{item}</Text>
              </View>
            ))}
            <TouchableOpacity onPress={goNext}>
              <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-full py-4 items-center">
                <Text className="text-white font-black text-[16px]">Upload My Report</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Stage: Upload */}
        {stage === 'upload' && (
          <View className="bg-surface border border-white/5 rounded-[28px] p-6 gap-4">
            <Text className="text-textSecondary text-[12px] font-bold uppercase tracking-widest">Step 4 — Report Upload</Text>
            <Text className="text-white text-[20px] font-black">Upload Your Lab Report</Text>
            <View className="border-2 border-dashed border-white/20 rounded-[20px] p-8 items-center gap-3">
              <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                <Upload color="#7C3AED" size={28} />
              </View>
              <Text className="text-textSecondary text-[13px] text-center">Tap to upload PDF or image</Text>
            </View>
            <TextInput
              value={reportName}
              onChangeText={setReportName}
              placeholder="Or enter report reference name..."
              placeholderTextColor="#555"
              className="bg-white/5 rounded-[16px] px-4 py-4 text-white border border-white/10 text-[14px]"
            />
            <TouchableOpacity onPress={goNext}>
              <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-full py-4 items-center">
                <Text className="text-white font-black text-[16px]">Run AI Analysis</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Stage: Analysis */}
        {stage === 'analysis' && (
          <View className="bg-surface border border-white/5 rounded-[28px] p-6 gap-4">
            <Text className="text-textSecondary text-[12px] font-bold uppercase tracking-widest">Step 5 — AI Analysis</Text>
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
                <Brain color="#7C3AED" size={24} />
              </View>
              <Text className="text-white text-[20px] font-black flex-1">Pattern Analysis Complete</Text>
            </View>
            <View className="bg-white/5 rounded-[20px] p-5">
              <Text className="text-white/80 text-[14px] leading-relaxed">
                Pattern suggests <Text className="text-[#EAB308] font-bold">insulin resistance risk</Text> and mild thyroid stress. Recommend sleep optimization and anti-inflammatory nutrition protocol.
              </Text>
            </View>
            <TouchableOpacity onPress={goNext}>
              <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-full py-4 items-center">
                <Text className="text-white font-black text-[16px]">Generate My Action Plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Stage: Plan */}
        {stage === 'plan' && (
          <View className="gap-4">
            <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">Step 6 — Your Action Plan</Text>
            {[
              { label: '4 strength + low-impact sessions/week', color: '#7C3AED' },
              { label: 'Balanced low-glycemic meal plan', color: '#22C55E' },
              { label: '7.5 hours sleep target nightly', color: '#00D4FF' },
              { label: 'Re-test blood markers in 8 weeks', color: '#F472B6' },
            ].map((item, i) => (
              <View key={i} className="bg-surface border border-white/5 rounded-[24px] p-5 flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                  <CheckCircle2 color={item.color} size={20} />
                </View>
                <Text className="text-white text-[15px] font-semibold flex-1">{item.label}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </ScreenWrapper>
  );
}
