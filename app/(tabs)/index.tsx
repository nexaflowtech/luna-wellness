import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  PlayCircle, 
  Utensils, 
  MessageCircle, 
  Activity,
  CalendarDays,
  LineChart,
  Dumbbell
} from 'lucide-react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { useAuth } from '@/src/context/AuthContext';

export default function DashboardScreen() {
  const { user, goal, healthScore } = useAuth();
  const userName = user?.displayName || "Luna Member";
  
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-textSecondary text-[15px] font-bold uppercase tracking-widest mb-1">Today's Overview</Text>
            <Text className="text-3xl font-extrabold text-textPrimary">Hello, {userName} 👋</Text>
          </View>
          <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
             <Image source={{ uri: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=100&auto=format&fit=crop' }} className="w-full h-full" />
          </View>
        </View>

        {/* AI COACH SHORTCUT (Constant) */}
        <TouchableOpacity activeOpacity={0.9} className="mb-6">
          <LinearGradient colors={['#7C3AED', '#00D4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-[1px] rounded-[32px]">
            <View className="bg-background rounded-[31px] p-6 flex-row items-center">
              <View className="w-14 h-14 rounded-[20px] bg-[#00D4FF]/20 items-center justify-center mr-5 border border-[#00D4FF]/30">
                <MessageCircle color="#00D4FF" size={28} />
              </View>
              <View className="flex-1">
                <Text className="text-white text-[18px] font-black mb-1">Hey, I'm Eva.</Text>
                <Text className="text-textSecondary text-[14px]">Ask me about today's plan!</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* CONDITIONAL WIDGETS BASED ON GOAL */}
        
        {goal === 'PCOS' || goal === 'Cycle Regulation' ? (
          <>
            {/* PCOS TRACKING */}
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1 bg-surface border border-white/5 rounded-[28px] p-5 relative overflow-hidden">
                <View className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <View className="flex-row items-center justify-between mb-4">
                  <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center">
                    <CalendarDays color="#F472B6" size={20} />
                  </View>
                  <Text className="text-textSecondary text-[12px] font-bold">CYCLE</Text>
                </View>
                <Text className="text-textPrimary text-[20px] font-black leading-tight mb-1">Follicular</Text>
                <Text className="text-secondary text-[14px] font-bold">Day 12</Text>
                <View className="flex-row mt-4 gap-1">
                  {[1,2,3,4,5,6,7].map((d, i) => (
                    <View key={i} className={`h-1.5 flex-1 rounded-full ${i === 3 ? 'bg-secondary' : 'bg-white/10'}`} />
                  ))}
                </View>
              </View>

              <View className="flex-1 bg-surface border border-white/5 rounded-[28px] p-5 relative overflow-hidden">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center">
                    <Activity color="#22C55E" size={20} />
                  </View>
                  <Text className="text-textSecondary text-[12px] font-bold">HORMONES</Text>
                </View>
                <Text className="text-textPrimary text-[20px] font-black leading-tight mb-1">Optimal</Text>
                <Text className="text-accent text-[14px] font-bold">Score: {healthScore ?? 92}</Text>
                <View className="mt-4 flex-row items-end flex-1 gap-1.5 h-6">
                  <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden absolute bottom-0 left-0 right-0">
                    <View className="w-[92%] h-full bg-accent rounded-full" />
                  </View>
                </View>
              </View>
            </View>
            
            <TouchableOpacity activeOpacity={0.95} className="bg-surface rounded-[32px] overflow-hidden border border-white/5 p-6 mb-4 relative">
              <View className="flex-row justify-between items-end mb-4">
                <View>
                  <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-1.5">Diet Suggestions</Text>
                  <Text className="text-white text-[20px] font-black">Anti-inflammatory</Text>
                </View>
                <View className="w-12 h-12 rounded-[20px] bg-accent/10 items-center justify-center border border-accent/20">
                  <Utensils color="#22C55E" size={24} />
                </View>
              </View>
            </TouchableOpacity>
          </>
        ) : goal === 'Muscle Gain' ? (
          <>
            {/* MUSCLE GAIN TRACKING */}
            <TouchableOpacity activeOpacity={0.95} className="bg-surface rounded-[32px] overflow-hidden mb-4 border border-white/5 relative">
              <View className="p-6 flex-row items-center">
                <View className="w-16 h-16 rounded-[24px] bg-primary/10 items-center justify-center border border-primary/20 mr-5">
                  <Dumbbell color="#7C3AED" size={32} />
                </View>
                <View className="flex-1">
                  <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-1">Weekly Split</Text>
                  <Text className="text-white text-[20px] font-black mb-1">Heavy Push Day</Text>
                  <Text className="text-primary text-[14px] font-bold">4 exercises • 45 min</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View className="bg-surface rounded-[32px] p-6 mb-4 border border-white/5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">Protein Intake</Text>
                <Text className="text-primary font-bold text-[14px]">120g / 180g</Text>
              </View>
              <View className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <View className="w-[66%] h-full bg-primary rounded-full" />
              </View>
            </View>
          </>
        ) : (
          <>
            {/* WEIGHT LOSS (Fallback Default) */}
            <TouchableOpacity activeOpacity={0.95} className="bg-surface rounded-[32px] overflow-hidden mb-4 border border-white/5 relative">
              <View className="p-6">
                <View className="flex-row items-center justify-between mb-5">
                  <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">Today's Workout</Text>
                  <View className="px-3 py-1 rounded-full bg-primary/20">
                    <Text className="text-primary text-[12px] font-bold">Cardio</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <View className="w-16 h-16 rounded-[24px] bg-primary/10 items-center justify-center border border-primary/20 mr-5">
                    <PlayCircle color="#7C3AED" size={32} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-[20px] font-black mb-1">HIIT Fat Burn</Text>
                    <Text className="text-textSecondary text-[14px]">🔥 Burn ~350 kcal</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.95} className="bg-surface rounded-[32px] overflow-hidden border border-white/5 p-6 mb-4">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">Calorie Deficit Tracker</Text>
                <Utensils color="#22C55E" size={20} />
              </View>
              <Text className="text-white text-[28px] font-black mb-3">1,420 <Text className="text-textSecondary text-[16px] font-medium">/ 1800 kcal</Text></Text>
              <View className="flex-row gap-2 h-3 rounded-full overflow-hidden bg-black/40">
                <View className="h-full bg-secondary" style={{ width: '40%' }} />
                <View className="h-full bg-[#00D4FF]" style={{ width: '35%' }} />
                <View className="h-full bg-[#EAB308]" style={{ width: '25%' }} />
              </View>
            </TouchableOpacity>
            
            <View className="bg-surface border border-white/5 rounded-[32px] p-6 mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-1.5">Weight Progress</Text>
                <Text className="text-white text-[20px] font-black">-1.2 kg this week</Text>
              </View>
              <View className="w-12 h-12 rounded-[20px] border border-primary/20 bg-primary/10 items-center justify-center">
                <LineChart color="#7C3AED" size={24} />
              </View>
            </View>
          </>
        )}

      </ScrollView>
    </ScreenWrapper>
  );
}
