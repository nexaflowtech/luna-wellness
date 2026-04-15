import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { useUser } from '@/src/context/UserContext';
import { logoutUser } from '@/src/services/authService';
import { router } from 'expo-router';
import { Target, Droplets, Apple, PauseCircle, LogOut, ChevronRight, Crown, Settings } from 'lucide-react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { Header } from '@/src/components/ui/Header';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { profile } = useUser();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/(onboarding)/login');
    } catch (e) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const name = profile?.displayName ?? 'Sarah Connor';
  const email = profile?.email ?? 'sarah.c@example.com';
  const avatarUri = profile?.photoURL ?? 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop';
  const bmiValue = "22.4";

  const SETTINGS = [
    { id: 'active_plan', title: 'Plan Details', icon: <Target color="#7C3AED" size={20} /> },
    { id: 'blood_tests', title: 'Blood & Hormones', icon: <Droplets color="#22C55E" size={20} /> },
    { id: 'dietician', title: 'Dietician Connect', icon: <Apple color="#F472B6" size={20} /> },
    { id: 'pause_plan', title: 'Pause Subscription', icon: <PauseCircle color="#EAB308" size={20} /> },
  ];

  return (
    <ScreenWrapper>
      <Header title="Profile" subtitle="Manage your account" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* User Summary Card */}
        <View className="bg-surface rounded-[32px] p-6 border border-white/5 mb-6 flex-row items-center relative overflow-hidden">
          <View className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <View className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden mr-5 bg-background">
            <Image source={{ uri: avatarUri }} className="w-full h-full" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-[22px] font-black tracking-tight mb-1">{name}</Text>
            <Text className="text-textSecondary text-[14px] font-medium">{email}</Text>
            <View className="bg-primary/20 self-start px-3 py-1 mt-3 rounded-full flex-row items-center gap-1.5 border border-primary/30">
              <Text className="text-primary text-[11px] font-black uppercase">BMI</Text>
              <Text className="text-white text-[12px] font-extrabold">{bmiValue}</Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 items-center justify-center">
            <Settings color="#8A8A93" size={20} />
          </TouchableOpacity>
        </View>

        {/* Goal Tracking Card */}
        <View className="bg-surface rounded-[32px] p-6 border border-white/5 mb-6">
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-5">Journey Progress</Text>
          <View className="flex-row items-end justify-between mb-4">
            <View>
              <Text className="text-white text-[28px] font-black">68.5 <Text className="text-textSecondary text-[16px]">kg</Text></Text>
              <Text className="text-accent text-[13px] font-bold mt-1">▼ 2.5 kg lost</Text>
            </View>
            <View className="items-end">
              <Text className="text-white text-[20px] font-black">62 <Text className="text-textSecondary text-[14px]">kg</Text></Text>
              <Text className="text-textSecondary text-[13px] font-medium mt-1">Target</Text>
            </View>
          </View>
          <View className="w-full h-3 bg-black/40 rounded-full overflow-hidden mt-2 relative">
             <View className="absolute left-0 top-0 bottom-0 bg-accent rounded-full w-[40%]" />
             <View className="absolute bg-white w-1.5 h-full rounded-full" style={{ left: '40%' }} />
          </View>
        </View>

        {/* Subscription Card */}
        <TouchableOpacity activeOpacity={0.9} className="mb-6">
          <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-[1px] rounded-[32px]">
            <View className="bg-[#14141A] rounded-[31px] p-6 relative overflow-hidden">
              <View className="absolute top-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <View className="flex-row items-center gap-4 mb-2">
                <View className="w-12 h-12 rounded-full bg-[#F472B6]/20 items-center justify-center border border-[#F472B6]/30">
                  <Crown color="#F472B6" size={24} />
                </View>
                <View>
                  <Text className="text-white text-[20px] font-black tracking-tight">Luna Pro Active</Text>
                  <Text className="text-[#F472B6] text-[13px] font-bold">Renews on Oct 12</Text>
                </View>
              </View>
              <Text className="text-textSecondary text-[14px] leading-snug mt-4">You have full access to personalized diet plans, AI coaches, and analytics.</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Settings List */}
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-2 mt-2">Account Capabilities</Text>
        <View className="bg-surface rounded-[32px] border border-white/5 px-2 py-2">
          {SETTINGS.map((item, index) => (
             <TouchableOpacity key={item.id} activeOpacity={0.7} className={`p-4 flex-row items-center justify-between ${index !== SETTINGS.length - 1 ? 'border-b border-white/5' : ''}`}>
               <View className="flex-row items-center gap-4">
                 <View className="w-10 h-10 rounded-xl bg-background items-center justify-center">
                   {item.icon}
                 </View>
                 <Text className="text-white text-[16px] font-bold">{item.title}</Text>
               </View>
               <ChevronRight color="#8A8A93" size={20} />
             </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleLogout} 
          activeOpacity={0.7} 
          className="mt-8 mb-4 flex-row items-center justify-center bg-red-500/10 py-5 rounded-[24px] border border-red-500/20"
        >
          <LogOut color="#EF4444" size={20} />
          <Text className="text-red-500 text-[16px] font-black ml-3">Log Out of Interface</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </ScreenWrapper>
  );
}
