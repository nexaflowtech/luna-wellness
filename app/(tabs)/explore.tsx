import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Apple, Stethoscope, PlayCircle, Sparkles } from 'lucide-react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { Header } from '@/src/components/ui/Header';

export default function ExploreScreen() {
  const labCategories = [
    { id: 'blood', title: 'Blood Tests', icon: <Activity color="#F472B6" size={22} />, color: '#F472B6' },
    { id: 'hormone', title: 'Hormone Panel', icon: <Stethoscope color="#7C3AED" size={22} />, color: '#7C3AED' },
    { id: 'dietian', title: 'Consult Dietitian', icon: <Apple color="#22C55E" size={22} />, color: '#22C55E' },
    { id: 'features', title: 'Luna Premium', icon: <Sparkles color="#EAB308" size={22} />, color: '#EAB308' },
  ];

  const healthPlans = [
    {
      id: '1',
      title: 'PCOS Recovery',
      subtitle: '12 Weeks • Nutrition + Wellness',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
      tag: 'Most Popular',
    },
    {
      id: '2',
      title: 'Pregnancy Fitness',
      subtitle: 'Trimester-mapped exercises',
      img: 'https://images.unsplash.com/photo-1518608241477-987820ebfaef?q=80&w=400&auto=format&fit=crop',
      tag: 'Top Rated',
    },
  ];

  const trendingClasses = [
    { id: '1', title: 'Zumba Cardio Blast', subtitle: '45 Mins • High Intensity', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop' },
    { id: '2', title: 'Morning Flow Yoga', subtitle: '30 Mins • Recovery', img: 'https://images.unsplash.com/photo-1599901860904-17e08c3d0cb4?q=80&w=400&auto=format&fit=crop' },
    { id: '3', title: 'HIIT Core Crusher', subtitle: '20 Mins • Intense', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <ScreenWrapper>
      <Header title="Explore" subtitle="Discover plans, classes & more" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Health Plans Section */}
        <View className="flex-row justify-between items-center mb-4 mt-2">
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">
            Targeted Health Plans
          </Text>
          <TouchableOpacity>
            <Text className="text-primary text-[13px] font-bold">See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingRight: 4 }}
          className="mb-8"
        >
          {healthPlans.map(plan => (
            <TouchableOpacity key={plan.id} activeOpacity={0.93} className="w-[260px] h-[180px] rounded-[28px] overflow-hidden relative">
              <Image source={{ uri: plan.img }} className="w-full h-full absolute" />
              <LinearGradient
                colors={['transparent', 'rgba(11,11,15,0.92)']}
                className="absolute inset-0 top-1/4"
              />
              <View className="absolute top-4 left-4">
                <View className="bg-accent px-3 py-1 rounded-full">
                  <Text className="text-black text-[11px] font-extrabold">{plan.tag}</Text>
                </View>
              </View>
              <View className="absolute bottom-5 left-5 right-5">
                <Text className="text-white text-[17px] font-black leading-tight mb-1">{plan.title}</Text>
                <Text className="text-white/70 text-[12px] font-medium">{plan.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lab & Consultation Grid */}
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-1">
          Lab Tests & Consultations
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
          {labCategories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.88}
              className="w-[48%] bg-surface border border-white/5 rounded-[28px] p-5 flex-row items-center gap-4"
            >
              <View
                className="w-12 h-12 rounded-[16px] items-center justify-center border"
                style={{ backgroundColor: `${cat.color}15`, borderColor: `${cat.color}30` }}
              >
                {cat.icon}
              </View>
              <Text className="text-white text-[14px] font-bold flex-1 leading-snug">{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Free Trial Banner */}
        <TouchableOpacity className="mb-8 rounded-[28px] overflow-hidden h-[180px] relative" activeOpacity={0.9}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop' }}
            className="w-full h-full absolute"
          />
          <LinearGradient
            colors={['rgba(124,58,237,0.85)', 'rgba(244,114,182,0.7)']}
            className="absolute inset-0"
          />
          <View className="flex-1 p-6 justify-between">
            <View className="bg-white/20 self-start px-3 py-1 rounded-full border border-white/30">
              <Text className="text-white text-[11px] font-black tracking-widest uppercase">7 Days Free</Text>
            </View>
            <View>
              <Text className="text-white text-[22px] font-black mb-1">Unlock All Premium Classes</Text>
              <Text className="text-white/80 text-[13px]">Access every live program and AI coach feature.</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Trending Classes */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">
            Trending Classes
          </Text>
          <TouchableOpacity>
            <Text className="text-primary text-[13px] font-bold">See All</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-4">
          {trendingClasses.map(item => (
            <TouchableOpacity key={item.id} activeOpacity={0.9}>
              <View className="bg-surface border border-white/5 rounded-[28px] overflow-hidden flex-row h-[90px] items-center">
                <Image
                  source={{ uri: item.img }}
                  className="w-[90px] h-full"
                  style={{ borderRadius: 22 }}
                />
                <View className="flex-1 px-4 justify-center">
                  <Text className="text-white text-[16px] font-black mb-1">{item.title}</Text>
                  <Text className="text-textSecondary text-[13px]">{item.subtitle}</Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 items-center justify-center mr-4">
                  <PlayCircle color="#7C3AED" size={22} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}
