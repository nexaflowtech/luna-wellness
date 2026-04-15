import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Badge } from '@/src/components/atoms/Badge';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { Header } from '@/src/components/ui/Header';
import { Play } from 'lucide-react-native';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'Yoga', 'HIIT', 'Mobility'];
const WORKOUTS = [
  { id: '1', title: 'Full Body Strength', duration: '35 min', level: 'Intermediate', kcal: 280, category: 'Strength', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500&auto=format&fit=crop' },
  { id: '2', title: 'HIIT Cardio Blast', duration: '20 min', level: 'Advanced', kcal: 320, category: 'HIIT', img: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=500&auto=format&fit=crop' },
  { id: '3', title: 'Morning Yoga Flow', duration: '25 min', level: 'Beginner', kcal: 120, category: 'Yoga', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop' },
];

const WEEK_DAYS = [
  { day: 'Mon', date: '12', active: false },
  { day: 'Tue', date: '13', active: true }, // Today
  { day: 'Wed', date: '14', active: false },
  { day: 'Thu', date: '15', active: false },
  { day: 'Fri', date: '16', active: false },
];

const LEVEL_COLOR: Record<string, 'success' | 'warning' | 'error'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'error',
};

export default function FitnessScreen() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? WORKOUTS : WORKOUTS.filter((w) => w.category === cat);

  return (
    <ScreenWrapper>
      <Header title="Fitness" subtitle="Your personalized curriculum" />

      {/* Weekly Plan Strip */}
      <View className="mb-6 px-5 mt-2">
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-3">This Week's Plan</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {WEEK_DAYS.map((w, idx) => (
             <View key={idx} className={`w-[66px] h-[90px] rounded-[24px] items-center justify-center border ${w.active ? 'bg-primary border-primary' : 'bg-surface border-white/5'}`}>
               <Text className={`text-[12px] font-bold uppercase mb-1 ${w.active ? 'text-white' : 'text-textSecondary'}`}>{w.day}</Text>
               <Text className={`text-[22px] font-black ${w.active ? 'text-white' : 'text-textPrimary'}`}>{w.date}</Text>
               {w.active && <View className="w-1.5 h-1.5 rounded-full bg-white mt-1.5" />}
             </View>
          ))}
        </ScrollView>
      </View>

      <View className="mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity 
              key={c} 
              onPress={() => setCat(c)} 
              className={`px-5 py-2.5 rounded-full border ${cat === c ? 'bg-white border-white' : 'bg-transparent border-white/10'}`}
            >
              <Text className={`text-[13px] font-bold ${cat === c ? 'text-background' : 'text-textSecondary'}`}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filtered.map((w) => (
          <TouchableOpacity key={w.id} onPress={() => router.push('/(secondary)/workout-detail' as any)} activeOpacity={0.95}>
            <View className="bg-surface rounded-[32px] overflow-hidden border border-white/5 h-[220px]">
              <Image source={{ uri: w.img }} className="w-full h-full absolute" />
              <LinearGradient colors={['transparent', 'rgba(11,11,15,0.95)']} className="absolute inset-0 top-1/3" />
              
              <View className="absolute right-5 top-5">
                <Badge label={w.level} variant={LEVEL_COLOR[w.level]} />
              </View>

              <View className="absolute bottom-6 left-6 right-6">
                <Text className="text-white text-[22px] font-black leading-tight mb-2">{w.title}</Text>
                
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                      <Text className="text-white text-[12px] font-bold">⏱ {w.duration}</Text>
                    </View>
                    <View className="bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                      <Text className="text-white text-[12px] font-bold">🔥 {w.kcal} kcal</Text>
                    </View>
                  </View>
                  <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                    <Play fill="#0B0B0F" color="#0B0B0F" size={16} style={{ marginLeft: 2 }} />
                  </View>
                </View>
              </View>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}
