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
  Droplets,
  Apple,
  Brain,
  Zap,
  Bell,
  Stethoscope
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
    <View className="flex-1 bg-background">
      {/* TopAppBar */}
      <View className="flex-row justify-between items-center px-6 pt-16 pb-4 bg-background/90 z-50">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
            <Image source={{ uri: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=100&auto=format&fit=crop' }} className="w-full h-full" />
          </View>
          <Text className="text-xl font-extrabold text-text-primary tracking-tighter">Luna Wellness</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container">
          <Bell color="#006e2f" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        className="px-6 pt-4"
      >
        {/* Active Plan Section */}
        <View className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <View className="flex-col gap-4">
            <View>
              <Text className="text-xs font-bold uppercase tracking-widest text-[#6d7b6c] mb-1">Active Plan</Text>
              <Text className="text-2xl font-extrabold tracking-tight text-text-primary">Zumba + Diet + Coach</Text>
            </View>
            <View className="w-full">
              <View className="flex-row justify-between items-end mb-2">
                <Text className="text-sm font-semibold text-primary">Day 14 of 30</Text>
                <Text className="text-sm font-bold text-text-primary">45%</Text>
              </View>
              <View className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                <LinearGradient
                  colors={['#006e2f', '#006b5f']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: '45%', height: '100%' }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Today's Plan Bento Grid */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-6">
            <Text className="text-xl font-extrabold tracking-tight text-text-primary">Today's Plan</Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-primary">View Calendar</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-4">
            {/* Workout Card */}
            <TouchableOpacity activeOpacity={0.9} className="bg-surface-container-lowest p-6 rounded-3xl border border-gray-100 shadow-sm flex-row items-center">
              <View className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mr-4 border border-primary/20">
                <Dumbbell color="#006e2f" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold mb-1 text-text-primary">Morning HIIT</Text>
                <Text className="text-sm text-[#3d4a3d]">45 mins • 320 kcal</Text>
              </View>
              <View className="bg-primary/10 px-3 py-1.5 rounded-lg">
                <Text className="text-[10px] font-bold text-primary uppercase">Cardio</Text>
              </View>
            </TouchableOpacity>

            {/* Diet Card */}
            <TouchableOpacity activeOpacity={0.9} className="bg-surface-container-lowest p-6 rounded-3xl border border-gray-100 shadow-sm flex-row items-center">
              <View className="w-14 h-14 rounded-2xl bg-[#006b5f]/10 flex items-center justify-center mr-4 border border-[#006b5f]/20">
                <Utensils color="#006b5f" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold mb-1 text-text-primary">Keto Mediterranean</Text>
                <Text className="text-sm text-[#3d4a3d]">Remaining: 840 kcal</Text>
              </View>
              <View className="bg-[#006b5f]/10 px-3 py-1.5 rounded-lg">
                <Text className="text-[10px] font-bold text-[#006b5f] uppercase">Lunch</Text>
              </View>
            </TouchableOpacity>

            {/* Hydration Card */}
            <TouchableOpacity activeOpacity={0.9} className="bg-surface-container-lowest p-6 rounded-3xl border border-gray-100 shadow-sm flex-row items-center">
              <View className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mr-4 border border-blue-500/20">
                <Droplets color="#3B82F6" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold mb-1 text-text-primary">Hydration</Text>
                <Text className="text-sm text-[#3d4a3d]">1.2L / 2.5L logged</Text>
              </View>
              <TouchableOpacity className="bg-surface-container-low px-4 py-2 rounded-xl">
                <Text className="text-[12px] font-bold text-text-primary">+ 250ml</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature Grid */}
        <View className="mb-10">
          <View className="flex-row flex-wrap justify-between gap-y-4">
            <FeatureBox icon={Apple} label="Diet Tracker" color="#006b5f" />
            <FeatureBox icon={CalendarDays} label="Period Tracker" color="#ba1a1a" />
            <FeatureBox icon={LineChart} label="AI Report" color="#005ac2" />
            <FeatureBox icon={Brain} label="Nutrition AI" color="#006e2f" />
          </View>
        </View>

        {/* Doctor Consultation CTA */}
        <View className="mb-10 relative rounded-3xl overflow-hidden shadow-sm">
          <LinearGradient
            colors={['#82abff', '#dce9ff']}
            className="p-8 flex-row items-center"
          >
            <View className="flex-1 pr-4 z-10">
              <Text className="text-2xl font-extrabold text-[#003d88] mb-2 leading-tight">Need professional advice?</Text>
              <Text className="text-[#003d88]/80 text-xs mb-6 max-w-xs">Book a 1-on-1 session with our certified wellness doctors.</Text>
              <TouchableOpacity className="bg-[#003d88] self-start px-6 py-3 rounded-full shadow-lg">
                <Text className="text-white font-bold text-sm tracking-wide">Consult Now</Text>
              </TouchableOpacity>
            </View>
            <View className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/40 shadow-xl z-10">
              <Image source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop' }} className="w-full h-full" />
            </View>
          </LinearGradient>
        </View>

        {/* Fitness Classes Horizontal Scroll */}
        <View className="mb-10 -mx-6">
          <View className="flex-row justify-between items-end mb-6 px-6">
            <Text className="text-xl font-extrabold tracking-tight text-text-primary">Fitness Classes</Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-primary">Explore All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            <ClassCard title="Zumba High Energy" coach="Elena" time="45 min" tag="Live Now" image="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400&auto=format&fit=crop" color="#006e2f" />
            <ClassCard title="Sunset Vinyasa" coach="Marcus" time="60 min" tag="Starts in 2h" image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop" color="#3d4a3d" />
          </ScrollView>
        </View>

      </ScrollView>

      {/* AI Coach FAB */}
      <TouchableOpacity className="absolute bottom-28 right-6 w-16 h-16 rounded-3xl shadow-xl shadow-primary/30 overflow-hidden active:scale-95 transition-all">
        <LinearGradient
          colors={['#006e2f', '#006b5f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-full items-center justify-center"
        >
          <Zap color="#ffffff" size={28} />
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
}

function FeatureBox({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="w-[47%] bg-surface-container-low p-4 rounded-[20px] items-center text-center justify-center"
    >
      <Icon color={color} size={32} className="mb-2" />
      <Text className="text-sm font-bold text-text-primary">{label}</Text>
    </TouchableOpacity>
  );
}

function ClassCard({ title, coach, time, tag, image, color }: any) {
  return (
    <View className="w-[260px] bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      <View className="h-40 relative">
        <Image source={{ uri: image }} className="w-full h-full" />
        <View style={{ backgroundColor: color }} className="absolute top-4 left-4 px-3 py-1.5 rounded-lg shadow-sm">
          <Text className="text-white text-[10px] font-bold uppercase tracking-wider">{tag}</Text>
        </View>
      </View>
      <View className="p-5">
        <Text className="font-bold text-lg mb-1 text-text-primary">{title}</Text>
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-sm font-bold text-[#3d4a3d]">Coach {coach}</Text>
          <Text className="text-sm font-bold text-primary">{time}</Text>
        </View>
      </View>
    </View>
  );
}
