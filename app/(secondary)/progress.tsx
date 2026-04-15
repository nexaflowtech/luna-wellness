import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, TrendingDown, Flame, Droplets, Activity, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PERIODS = ['1W', '1M', '3M', '6M'];

// Simulated bar chart data (relative heights 0–1)
const WEIGHT_DATA = [0.88, 0.84, 0.80, 0.78, 0.74, 0.70, 0.65];
const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const METRICS = [
  { label: 'Current Weight', value: '68.5', unit: 'kg', delta: '▼ 2.5 kg', positive: true, color: '#22C55E', icon: <TrendingDown color="#22C55E" size={20} /> },
  { label: 'Body Fat', value: '26.4', unit: '%', delta: '▼ 1.2%', positive: true, color: '#7C3AED', icon: <Activity color="#7C3AED" size={20} /> },
  { label: 'Avg Calories', value: '1,620', unit: 'kcal/day', delta: '↑ on track', positive: true, color: '#F472B6', icon: <Flame color="#F472B6" size={20} /> },
  { label: 'Hydration', value: '2.1', unit: 'L/day', delta: '▲ 0.3L', positive: true, color: '#00D4FF', icon: <Droplets color="#00D4FF" size={20} /> },
];

const ACHIEVEMENTS = [
  { label: '7-Day Streak', emoji: '🔥', color: '#F472B6' },
  { label: '5 kg Lost', emoji: '⚡', color: '#7C3AED' },
  { label: 'Hydration Pro', emoji: '💧', color: '#00D4FF' },
];

export default function ProgressScreen() {
  const [period, setPeriod] = useState('1W');

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-[22px] font-black">Progress</Text>
          <Text className="text-textSecondary text-[13px]">Track your wellness journey</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center border border-accent/20">
          <Target color="#22C55E" size={20} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 20 }} showsVerticalScrollIndicator={false}>

        {/* Goal Progress Card */}
        <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-[32px] p-[1px] mt-2">
          <View className="bg-[#14141A] rounded-[31px] p-6">
            <Text className="text-textSecondary text-[12px] font-bold uppercase tracking-widest mb-4">Weight Goal Progress</Text>
            <View className="flex-row justify-between items-end mb-5">
              <View>
                <Text className="text-white text-[36px] font-black leading-none">68.5</Text>
                <Text className="text-textSecondary text-[14px] font-medium mt-1">kg · Current</Text>
              </View>
              <View className="items-end">
                <Text className="text-accent text-[20px] font-black">62.0</Text>
                <Text className="text-textSecondary text-[13px] font-medium mt-0.5">kg · Target</Text>
              </View>
            </View>
            <View className="h-3 bg-white/10 rounded-full overflow-hidden relative mb-3">
              <View className="h-full bg-accent rounded-full w-[42%]" />
              <View className="absolute w-1 h-full bg-white/50 rounded-full" style={{ left: '42%' }} />
            </View>
            <Text className="text-accent text-[13px] font-bold">42% of goal reached · 6.5 kg to go</Text>
          </View>
        </LinearGradient>

        {/* Metric Cards */}
        <View>
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Key Metrics</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {METRICS.map(m => (
              <View key={m.label} className="w-[48%] bg-surface border border-white/5 rounded-[24px] p-5">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: `${m.color}15` }}>
                    {m.icon}
                  </View>
                  <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: `${m.color}15` }}>
                    <Text className="text-[10px] font-bold" style={{ color: m.color }}>{m.delta}</Text>
                  </View>
                </View>
                <Text className="text-textSecondary text-[11px] font-bold uppercase tracking-wide mb-1">{m.label}</Text>
                <Text className="text-white text-[22px] font-black leading-tight">
                  {m.value}
                  <Text className="text-textSecondary text-[12px] font-medium"> {m.unit}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weight Chart */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">Weight Trend</Text>
            <View className="flex-row gap-2">
              {PERIODS.map(p => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPeriod(p)}
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: period === p ? '#7C3AED20' : 'rgba(255,255,255,0.05)',
                    borderWidth: 1,
                    borderColor: period === p ? '#7C3AED50' : 'transparent',
                  }}
                >
                  <Text className="text-[12px] font-bold" style={{ color: period === p ? '#7C3AED' : '#8A8A93' }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="bg-surface border border-white/5 rounded-[28px] p-6">
            {/* Y axis reference lines */}
            {[0.75, 0.5, 0.25].map(y => (
              <View key={y} className="absolute left-6 right-6 h-[1px] bg-white/5" style={{ top: `${(1 - y) * 70 + 8}%` }} />
            ))}

            {/* Bars */}
            <View className="flex-row items-end justify-between h-[140px]">
              {WEIGHT_DATA.map((val, i) => (
                <View key={i} className="flex-1 items-center gap-2 mx-1">
                  <View
                    className="w-full rounded-t-[10px]"
                    style={{
                      height: val * 120,
                      backgroundColor: i === WEIGHT_DATA.length - 1 ? '#22C55E' : '#7C3AED40',
                      borderWidth: i === WEIGHT_DATA.length - 1 ? 1 : 0,
                      borderColor: '#22C55E60',
                    }}
                  />
                </View>
              ))}
            </View>

            {/* X labels */}
            <View className="flex-row justify-between mt-3">
              {LABELS.map(l => (
                <Text key={l} className="text-textSecondary text-[10px] font-bold text-center flex-1">{l}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View>
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Achievements</Text>
          <View className="flex-row gap-4">
            {ACHIEVEMENTS.map(a => (
              <View key={a.label} className="flex-1 bg-surface border border-white/5 rounded-[22px] p-5 items-center gap-3">
                <View
                  className="w-14 h-14 rounded-full items-center justify-center text-3xl"
                  style={{ backgroundColor: `${a.color}15` }}
                >
                  <Text className="text-3xl">{a.emoji}</Text>
                </View>
                <Text className="text-white text-[12px] font-bold text-center leading-snug">{a.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}
