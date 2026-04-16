import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  PlayCircle,
  Utensils,
  MessageCircle,
  Activity,
  CalendarDays,
  LineChart,
  Dumbbell,
  Users,
  Search,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  LayoutGrid,
  Apple,
  ClipboardList,
  Target
} from 'lucide-react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { useAuth } from '@/src/context/AuthContext';
import { useDashboardData } from '@/src/hooks/useDashboardData';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user, healthScore } = useAuth();
  const { cycle, hormones, diet, workout, isLoading } = useDashboardData();

  const userName = user?.displayName || "Luna Member";

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="bg-background"
      >
        {/* TOP: ACTIVE PLAN & PROGRESS */}
        <View className="px-6 pt-6 mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-textSecondary text-[14px] font-bold uppercase tracking-widest mb-1">Welcome back</Text>
              <Text className="text-3xl font-black text-white">{userName} ✨</Text>
            </View>
            <TouchableOpacity className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
              <Image source={{ uri: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=100&auto=format&fit=crop' }} className="w-full h-full" />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[32px] p-6 shadow-xl shadow-primary/20"
          >
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Active Plan</Text>
                <Text className="text-white text-xl font-black">Zumba + Diet + Coach</Text>
              </View>
              <View className="bg-white/20 p-2 rounded-xl">
                <Target color="#FFF" size={20} />
              </View>
            </View>

            <View className="flex-row justify-between items-end">
              <View className="flex-1 mr-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-white/80 text-xs">Plan Progress</Text>
                  <Text className="text-white text-xs font-bold">12%</Text>
                </View>
                <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <View className="h-full bg-white rounded-full" style={{ width: '12%' }} />
                </View>
              </View>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-full">
                <Text className="text-primary text-xs font-black">Keep Going</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* SECTION 1: TRANSFORMATION CAROUSEL */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-6 mb-4">
            <Text className="text-white text-lg font-black tracking-tight">Success Stories</Text>
            <TouchableOpacity>
              <Text className="text-primary text-xs font-bold">View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          >
            {[
              { id: 1, name: 'Anjali R.', result: '8kg Weight Loss', tag: 'Zumba + Diet' },
              { id: 2, name: 'Priya M.', result: 'Thyroid Fixed', tag: 'Special Keto' },
              { id: 3, name: 'Sonia K.', result: 'PCOS Reversed', tag: 'Hormone Bal.' }
            ].map((story) => (
              <View key={story.id} className="w-[280px] h-[160px] bg-surface rounded-[28px] mr-4 p-5 border border-white/5 overflow-hidden">
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  className="absolute bottom-0 left-0 right-0 h-24"
                />
                <View className="bg-primary/20 self-start px-2 py-1 rounded-lg mb-2">
                  <Text className="text-primary text-[10px] font-black uppercase tracking-wider">{story.tag}</Text>
                </View>
                <View className="mt-auto">
                  <Text className="text-white text-lg font-black">{story.result}</Text>
                  <Text className="text-white/60 text-xs">{story.name} • 3 months journey</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* SECTION 2: TODAY'S PLAN */}
        <View className="px-6 mb-8">
          <Text className="text-white text-lg font-black mb-4">Today's Protocol</Text>

          <View className="flex-row gap-4 mb-4">
            {/* Workout */}
            <TouchableOpacity
              activeOpacity={0.9}
              className="flex-1 bg-surface rounded-[28px] p-5 border border-white/5"
            >
              <View className="w-10 h-10 rounded-2xl bg-[#7C3AED1A] items-center justify-center mb-4 border border-[#7C3AED33]">
                <Dumbbell color="#7C3AED" size={20} />
              </View>
              <Text className="text-white/60 text-[11px] font-bold uppercase mb-1">Workout</Text>
              <Text className="text-white text-[16px] font-black mb-1">{workout.title || 'Zumba Burn'}</Text>
              <Text className="text-primary text-[12px] font-bold">{workout.durationMin || '45'} min Session</Text>
            </TouchableOpacity>

            {/* Diet */}
            <TouchableOpacity
              activeOpacity={0.9}
              className="flex-1 bg-surface rounded-[28px] p-5 border border-white/5"
            >
              <View className="w-10 h-10 rounded-2xl bg-[#22C55E1A] items-center justify-center mb-4 border border-[#22C55E33]">
                <Utensils color="#22C55E" size={20} />
              </View>
              <Text className="text-white/60 text-[11px] font-bold uppercase mb-1">Next Meal</Text>
              <Text className="text-white text-[16px] font-black mb-1">{diet.mealName || 'Green Salad'}</Text>
              <Text className="text-accent text-[12px] font-bold">{diet.kcal || '450'} Kcal Target</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-surface rounded-[28px] p-5 border border-white/5 flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-orange-500/10 items-center justify-center mr-4 border border-orange-500/20">
              <TrendingUp color="#F97316" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-white/60 text-[11px] font-bold uppercase mb-0.5">Habit Tracker</Text>
              <Text className="text-white text-[15px] font-black">2L Water Target</Text>
            </View>
            <View className="flex-row gap-1">
              {[...Array(5)].map((_, i) => (
                <View key={i} className={`w-1.5 h-6 rounded-full ${i < 3 ? 'bg-orange-500' : 'bg-white/10'}`} />
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION 3: DOCTOR CONSULTATION */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={['#0F172A', '#1E293B']}
            className="rounded-[32px] p-6 border border-white/5"
          >
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-[20px] bg-blue-500/20 items-center justify-center mr-4">
                <Stethoscope color="#3B82F6" size={24} />
              </View>
              <View>
                <Text className="text-white text-lg font-black">Expert Help</Text>
                <Text className="text-white/60 text-xs">Book a consultation now</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-blue-500 rounded-2xl py-3 items-center">
              <Text className="text-white font-black">Find a Specialist</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* SECTION 4: FITNESS CLASSES */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-6 mb-4">
            <Text className="text-white text-lg font-black tracking-tight">Live Classes</Text>
            <TouchableOpacity>
              <Text className="text-primary text-xs font-bold">Join Now</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          >
            {[
              { title: 'Zumba Core', trainer: 'Sarah K.', time: 'LIVE', color: '#7C3AED' },
              { title: 'Morning Yoga', trainer: 'David L.', time: '7:00 AM', color: '#10B981' },
              { title: 'HIIT Blast', trainer: 'Mike J.', time: '6:30 PM', color: '#EF4444' }
            ].map((cl, i) => (
              <View key={i} className="w-[180px] bg-surface rounded-[28px] mr-4 p-5 border border-white/5">
                <View style={{ backgroundColor: `${cl.color}20` }} className="w-8 h-8 rounded-lg items-center justify-center mb-4">
                  <PlayCircle color={cl.color} size={18} />
                </View>
                <Text className="text-white font-black mb-0.5">{cl.title}</Text>
                <Text className="text-white/60 text-[10px]">{cl.trainer}</Text>
                <View className="mt-4 bg-white/5 py-1.5 rounded-xl items-center">
                  <Text style={{ color: cl.color === '#EF4444' ? '#EF4444' : cl.color }} className="text-[10px] font-black">{cl.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* SECTION 5: AI COACH (ASK EVA) */}
        <View className="px-6 mb-8">
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-[32px] p-6 shadow-xl shadow-accent/20"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 mr-4">
                  <Text className="text-white text-xl font-black mb-1">Ask Eva AI</Text>
                  <Text className="text-white/80 text-sm italic">"Should I eat more protein today?"</Text>
                </View>
                <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                  <MessageCircle color="#FFF" size={28} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* SECTION 6: FEATURES GRID */}
        <View className="px-6 mb-12">
          <Text className="text-white text-lg font-black mb-4">Explore Tools</Text>
          <View className="flex-row flex-wrap justify-between gap-4">
            <FeatureItem icon={Apple} label="Nutrition AI" color="#FACC15" />
            <FeatureItem icon={ClipboardList} label="Diet Tracker" color="#EF4444" />
            <FeatureItem icon={CalendarDays} label="Period Tracker" color="#F472B6" />
            <FeatureItem icon={LineChart} label="AI Report" color="#3B82F6" />
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

function FeatureItem({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="w-[47%] bg-surface rounded-[24px] p-5 border border-white/5 items-center justify-center"
    >
      <View style={{ backgroundColor: `${color}15` }} className="w-12 h-12 rounded-2xl items-center justify-center mb-3">
        <Icon color={color} size={24} />
      </View>
      <Text className="text-white/80 text-xs font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
