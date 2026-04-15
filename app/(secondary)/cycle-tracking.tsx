import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, CalendarDays, Droplets, Zap, Moon, Sun, Wind } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PHASES = [
  { name: 'Menstrual', days: '1–5', color: '#F472B6', icon: <Droplets color="#F472B6" size={18} />, tip: 'Rest, gentle yoga, iron-rich foods.' },
  { name: 'Follicular', days: '6–13', color: '#7C3AED', icon: <Sun color="#7C3AED" size={18} />, tip: 'High energy — great for strength training.' },
  { name: 'Ovulation', days: '14–16', color: '#22C55E', icon: <Zap color="#22C55E" size={18} />, tip: 'Peak fertility window. Maximize HIIT.' },
  { name: 'Luteal', days: '17–28', color: '#EAB308', icon: <Moon color="#EAB308" size={18} />, tip: 'Energy dips. Prioritize sleep & whole foods.' },
];

const CYCLE_DAY = 12;
const CYCLE_LENGTH = 28;
const CURRENT_PHASE = 'Follicular';

const TIMELINE_EVENTS = [
  { day: 'Day 1', event: 'Period started', type: 'period', done: true },
  { day: 'Day 5', event: 'Period ended', type: 'period', done: true },
  { day: 'Day 7', event: 'Energy surge detected', type: 'energy', done: true },
  { day: 'Day 12', event: 'Today — Peak follicular', type: 'today', done: false },
  { day: 'Day 14', event: 'Predicted ovulation', type: 'ovulation', done: false },
  { day: 'Day 28', event: 'Next period expected', type: 'period', done: false },
];

const EVENT_COLORS: Record<string, string> = {
  period: '#F472B6',
  energy: '#22C55E',
  today: '#7C3AED',
  ovulation: '#00D4FF',
};

export default function CycleTrackingScreen() {
  const [selectedPhase, setSelectedPhase] = useState(CURRENT_PHASE);
  const phase = PHASES.find(p => p.name === selectedPhase) ?? PHASES[1];
  const progressPercent = (CYCLE_DAY / CYCLE_LENGTH) * 100;

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-[22px] font-black">Cycle Tracker</Text>
          <Text className="text-textSecondary text-[13px]">Day {CYCLE_DAY} of {CYCLE_LENGTH}</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center border border-secondary/20">
          <CalendarDays color="#F472B6" size={20} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 20 }} showsVerticalScrollIndicator={false}>

        {/* Current Phase Hero Card */}
        <LinearGradient
          colors={['#7C3AED', '#F472B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[32px] p-[1px]"
        >
          <View className="bg-[#14141A] rounded-[31px] p-6">
            <Text className="text-textSecondary text-[12px] font-bold uppercase tracking-widest mb-2">Current Phase</Text>
            <Text className="text-white text-[32px] font-black mb-1">{CURRENT_PHASE}</Text>
            <Text className="text-secondary text-[14px] font-semibold mb-6">Days 6–13 • High Energy Phase</Text>

            {/* Progress bar */}
            <View className="mb-2">
              <View className="flex-row justify-between mb-2">
                <Text className="text-textSecondary text-[12px] font-bold">Day {CYCLE_DAY}</Text>
                <Text className="text-textSecondary text-[12px] font-bold">Day {CYCLE_LENGTH}</Text>
              </View>
              <View className="h-3 bg-white/10 rounded-full overflow-hidden">
                <View className="h-full bg-secondary rounded-full" style={{ width: `${progressPercent}%` }} />
              </View>
              {/* Day markers */}
              <View className="flex-row justify-between mt-2">
                {[0, 5, 13, 16, 28].map(d => (
                  <View key={d} className="items-center">
                    <View className="w-0.5 h-2 bg-white/20" />
                    <Text className="text-white/40 text-[10px] mt-1">{d}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Metric Cards Row */}
        <View className="flex-row gap-4">
          <View className="flex-1 bg-surface border border-white/5 rounded-[24px] p-5">
            <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mb-3">
              <Wind color="#F472B6" size={18} />
            </View>
            <Text className="text-textSecondary text-[11px] font-bold uppercase tracking-wider mb-1">Cycle Length</Text>
            <Text className="text-white text-[24px] font-black">28 <Text className="text-textSecondary text-[14px] font-medium">days</Text></Text>
          </View>
          <View className="flex-1 bg-surface border border-white/5 rounded-[24px] p-5">
            <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center mb-3">
              <Zap color="#22C55E" size={18} />
            </View>
            <Text className="text-textSecondary text-[11px] font-bold uppercase tracking-wider mb-1">Next Period</Text>
            <Text className="text-white text-[24px] font-black">16 <Text className="text-textSecondary text-[14px] font-medium">days</Text></Text>
          </View>
        </View>

        {/* Phase Selector */}
        <View>
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Cycle Phases</Text>
          <View className="flex-row gap-3 flex-wrap">
            {PHASES.map(p => (
              <TouchableOpacity
                key={p.name}
                onPress={() => setSelectedPhase(p.name)}
                className="flex-row items-center gap-2 px-4 py-2.5 rounded-full border"
                style={{
                  backgroundColor: selectedPhase === p.name ? `${p.color}20` : 'rgba(255,255,255,0.04)',
                  borderColor: selectedPhase === p.name ? `${p.color}60` : 'rgba(255,255,255,0.08)',
                }}
              >
                {p.icon}
                <Text className="text-[13px] font-bold" style={{ color: selectedPhase === p.name ? p.color : '#8A8A93' }}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Phase detail card */}
          <View
            className="mt-4 rounded-[24px] p-5 border"
            style={{ backgroundColor: `${phase.color}10`, borderColor: `${phase.color}30` }}
          >
            <Text className="text-[16px] font-black mb-2" style={{ color: phase.color }}>{phase.name} Phase · Days {phase.days}</Text>
            <Text className="text-white/80 text-[14px] leading-snug">{phase.tip}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View>
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">This Cycle's Timeline</Text>
          <View className="bg-surface border border-white/5 rounded-[28px] px-5 py-4">
            {TIMELINE_EVENTS.map((ev, i) => (
              <View key={i} className="flex-row items-start" style={{ opacity: ev.done ? 1 : 0.6 }}>
                {/* Dot + Line */}
                <View className="items-center" style={{ width: 20, marginRight: 16, paddingTop: 2 }}>
                  <View
                    className="w-3 h-3 rounded-full border-2"
                    style={{
                      backgroundColor: ev.type === 'today' ? EVENT_COLORS[ev.type] : 'transparent',
                      borderColor: EVENT_COLORS[ev.type],
                    }}
                  />
                  {i < TIMELINE_EVENTS.length - 1 && (
                    <View className="w-0.5 flex-1 bg-white/10" style={{ minHeight: 28 }} />
                  )}
                </View>
                {/* Content */}
                <View className="flex-1 pb-6">
                  <Text className="text-[11px] font-extrabold uppercase mb-1" style={{ color: EVENT_COLORS[ev.type] }}>{ev.day}</Text>
                  <Text className="text-white text-[15px] font-bold">{ev.event}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}
