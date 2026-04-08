import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Stage = 'quiz' | 'score' | 'blood' | 'upload' | 'analysis' | 'plan';

export default function HormoneInsightsScreen() {
  const [stage, setStage] = useState<Stage>('quiz');
  const [quizAnswer, setQuizAnswer] = useState('high');
  const [reportName, setReportName] = useState('');

  const aiScore = useMemo(() => {
    if (quizAnswer === 'low') return 82;
    if (quizAnswer === 'moderate') return 68;
    return 54;
  }, [quizAnswer]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 12, paddingBottom: 40 }}>
        <Text className="font-headline text-3xl font-extrabold text-on-surface">Hormone Insights</Text>
        <Text className="text-on-surface-variant">Smart health checkup flow</Text>

        {stage === 'quiz' && (
          <View className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 gap-3">
            <Text className="font-bold text-on-surface">Risk Quiz</Text>
            <Text className="text-on-surface-variant">How frequent are fatigue and cycle irregularities?</Text>
            {['low', 'moderate', 'high'].map((v) => (
              <TouchableOpacity key={v} onPress={() => setQuizAnswer(v)} className={`rounded-xl px-4 py-3 border ${quizAnswer === v ? 'border-primary bg-primary-fixed/40' : 'border-outline-variant/40'}`}>
                <Text className="capitalize text-on-surface">{v}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="bg-primary rounded-full py-3 items-center mt-2" onPress={() => setStage('score')}>
              <Text className="text-on-primary font-bold">Generate AI Score</Text>
            </TouchableOpacity>
          </View>
        )}

        {stage === 'score' && (
          <View className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 gap-2">
            <Text className="font-bold text-on-surface">AI Score Generation</Text>
            <Text className="text-primary text-4xl font-extrabold">{aiScore}/100</Text>
            <Text className="text-on-surface-variant">Risk level: {aiScore < 60 ? 'High' : aiScore < 75 ? 'Medium' : 'Low'}</Text>
            <TouchableOpacity className="bg-primary rounded-full py-3 items-center mt-2" onPress={() => setStage('blood')}>
              <Text className="text-on-primary font-bold">View Blood Test Recommendations</Text>
            </TouchableOpacity>
          </View>
        )}

        {stage === 'blood' && (
          <View className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 gap-2">
            <Text className="font-bold text-on-surface">Blood Test Recommendation</Text>
            <Text className="text-on-surface-variant">• Thyroid panel (TSH, T3, T4)</Text>
            <Text className="text-on-surface-variant">• Fasting insulin and glucose</Text>
            <Text className="text-on-surface-variant">• LH/FSH ratio and prolactin</Text>
            <TouchableOpacity className="bg-primary rounded-full py-3 items-center mt-2" onPress={() => setStage('upload')}>
              <Text className="text-on-primary font-bold">Upload Report</Text>
            </TouchableOpacity>
          </View>
        )}

        {stage === 'upload' && (
          <View className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 gap-2">
            <Text className="font-bold text-on-surface">Report Upload</Text>
            <TextInput
              value={reportName}
              onChangeText={setReportName}
              placeholder="Report file name"
              placeholderTextColor="#8f6f74"
              className="bg-surface-container-high rounded-xl px-4 py-3 text-on-surface"
            />
            <TouchableOpacity className="bg-primary rounded-full py-3 items-center mt-2" onPress={() => setStage('analysis')}>
              <Text className="text-on-primary font-bold">Run AI Analysis</Text>
            </TouchableOpacity>
          </View>
        )}

        {stage === 'analysis' && (
          <View className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 gap-2">
            <Text className="font-bold text-on-surface">AI Analysis</Text>
            <Text className="text-on-surface-variant">
              Pattern suggests insulin resistance risk and mild thyroid stress. Recommend sleep optimization and anti-inflammatory nutrition.
            </Text>
            <TouchableOpacity className="bg-primary rounded-full py-3 items-center mt-2" onPress={() => setStage('plan')}>
              <Text className="text-on-primary font-bold">Generate Action Plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {stage === 'plan' && (
          <View className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 gap-2">
            <Text className="font-bold text-on-surface">Action Plan</Text>
            <Text className="text-on-surface-variant">• 4 strength + low-impact sessions/week</Text>
            <Text className="text-on-surface-variant">• Balanced low-glycemic meal plan</Text>
            <Text className="text-on-surface-variant">• 7.5 hours sleep target</Text>
            <Text className="text-on-surface-variant">• Re-test blood markers in 8 weeks</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
