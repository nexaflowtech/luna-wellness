import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, Play, Flame, Clock, Zap, ChevronRight, BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const EXERCISE_SETS = [
  { name: 'Warm Up', duration: '5 min', reps: null, sets: null, done: true },
  { name: 'Squat to Press', duration: null, reps: '12 reps', sets: '3 sets', done: true },
  { name: 'Deadlift', duration: null, reps: '10 reps', sets: '3 sets', done: false },
  { name: 'Plank Hold', duration: '45 sec', reps: null, sets: '3 sets', done: false },
  { name: 'Hip Thrusts', duration: null, reps: '15 reps', sets: '3 sets', done: false },
  { name: 'Cool Down', duration: '5 min', reps: null, sets: null, done: false },
];

const METRICS = [
  { label: 'Duration', value: '35', unit: 'min', color: '#7C3AED', icon: <Clock color="#7C3AED" size={18} /> },
  { label: 'Calories', value: '280', unit: 'kcal', color: '#F472B6', icon: <Flame color="#F472B6" size={18} /> },
  { label: 'Intensity', value: 'Med', unit: 'level', color: '#EAB308', icon: <Zap color="#EAB308" size={18} /> },
];

export default function WorkoutDetailScreen() {
  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <Text className="text-white text-[22px] font-black flex-1">Workout Detail</Text>
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
          <BarChart3 color="#7C3AED" size={20} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>

        {/* Hero Image */}
        <View className="mx-5 mt-2 h-[200px] rounded-[32px] overflow-hidden mb-6">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=700&auto=format&fit=crop' }}
            className="w-full h-full"
          />
          <LinearGradient colors={['transparent', 'rgba(11,11,15,0.9)']} className="absolute inset-0 top-1/4" />
          <View className="absolute bottom-5 left-5 right-5">
            <View className="bg-[#7C3AED]/80 self-start px-3 py-1 rounded-full mb-2">
              <Text className="text-white text-[11px] font-extrabold">FULL BODY STRENGTH</Text>
            </View>
            <Text className="text-white text-[22px] font-black">Full Body Strength</Text>
            <Text className="text-white/70 text-[13px] font-medium">Intermediate · Today's Session</Text>
          </View>
        </View>

        <View className="px-5 gap-6">
          {/* Metric Cards Row */}
          <View className="flex-row gap-4">
            {METRICS.map(m => (
              <View key={m.label} className="flex-1 bg-surface border border-white/5 rounded-[22px] p-4 items-center gap-2">
                <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: `${m.color}15` }}>
                  {m.icon}
                </View>
                <Text className="text-white text-[22px] font-black leading-none">{m.value}</Text>
                <Text className="text-textSecondary text-[11px] font-bold uppercase">{m.unit}</Text>
              </View>
            ))}
          </View>

          {/* Exercise List */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">Exercise Plan</Text>
              <Text className="text-accent text-[13px] font-bold">2 / 6 Done</Text>
            </View>
            <View className="bg-surface border border-white/5 rounded-[28px] px-5 py-3">
              {EXERCISE_SETS.map((ex, i) => (
                <View
                  key={i}
                  className={`flex-row items-center py-4 ${i < EXERCISE_SETS.length - 1 ? 'border-b border-white/5' : ''}`}
                  style={{ opacity: ex.done ? 0.55 : 1 }}
                >
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-4 border"
                    style={{
                      backgroundColor: ex.done ? '#22C55E15' : 'rgba(255,255,255,0.05)',
                      borderColor: ex.done ? '#22C55E40' : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <Text className="text-[11px] font-black" style={{ color: ex.done ? '#22C55E' : '#8A8A93' }}>{i + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-[15px] font-bold">{ex.name}</Text>
                    <Text className="text-textSecondary text-[12px] font-medium mt-0.5">
                      {[ex.sets, ex.reps, ex.duration].filter(Boolean).join(' · ')}
                    </Text>
                  </View>
                  {!ex.done && (
                    <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                      <ChevronRight color="#555" size={16} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-background border-t border-white/5">
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.back()}>
          <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-[20px] py-5 items-center flex-row justify-center gap-3">
            <Play fill="white" color="white" size={18} />
            <Text className="text-white font-black text-[17px]">Start Workout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
