import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, Flame, Beef, Wheat, Droplets, Clock, ChefHat, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MACROS = [
  { label: 'Calories', value: '620', unit: 'kcal', icon: <Flame color="#F472B6" size={20} />, color: '#F472B6', bar: 0.62 },
  { label: 'Protein', value: '32', unit: 'g', icon: <Beef color="#7C3AED" size={20} />, color: '#7C3AED', bar: 0.58 },
  { label: 'Carbs', value: '64', unit: 'g', icon: <Wheat color="#EAB308" size={20} />, color: '#EAB308', bar: 0.71 },
  { label: 'Fats', value: '18', unit: 'g', icon: <Droplets color="#00D4FF" size={20} />, color: '#00D4FF', bar: 0.30 },
];

const INGREDIENTS = [
  'Organic Quinoa (180g)',
  'Firm Tofu, grilled (120g)',
  'Baby Spinach (60g)',
  'Avocado, half (75g)',
  'Pumpkin Seeds (20g)',
  'Lemon tahini dressing (2 tbsp)',
];

const STEPS = [
  'Cook quinoa in salted water for 15 minutes until fluffy.',
  'Pan-sear tofu with olive oil, garlic, and paprika.',
  'Massage spinach lightly with lemon juice.',
  'Assemble bowl and drizzle tahini dressing over top.',
  'Top with pumpkin seeds and avocado slices.',
];

export default function MealDetailScreen() {
  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <Text className="text-white text-[22px] font-black flex-1">Meal Detail</Text>
        <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center border border-accent/20">
          <ChefHat color="#22C55E" size={20} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Hero Image */}
        <View className="mx-5 mt-2 h-[220px] rounded-[32px] overflow-hidden mb-6">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=700&auto=format&fit=crop' }}
            className="w-full h-full"
          />
          <LinearGradient colors={['transparent', 'rgba(11,11,15,0.85)']} className="absolute inset-0 top-1/3" />
          <View className="absolute bottom-5 left-5 right-5">
            <View className="flex-row gap-2 mb-2">
              <View className="bg-accent/90 px-3 py-1 rounded-full">
                <Text className="text-black text-[11px] font-extrabold">LUNCH</Text>
              </View>
              <View className="bg-white/15 px-3 py-1 rounded-full flex-row items-center gap-1">
                <Clock color="white" size={11} />
                <Text className="text-white text-[11px] font-bold">1:00 PM</Text>
              </View>
            </View>
            <Text className="text-white text-[24px] font-black leading-tight">Quinoa Protein Bowl</Text>
          </View>
        </View>

        <View className="px-5 gap-6">
          {/* Macro Metric Cards */}
          <View>
            <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Nutritional Breakdown</Text>
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {MACROS.map(m => (
                <View key={m.label} className="w-[48%] bg-surface border border-white/5 rounded-[24px] p-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: `${m.color}15` }}>
                      {m.icon}
                    </View>
                    <Text className="text-textSecondary text-[11px] font-bold uppercase tracking-wide">{m.label}</Text>
                  </View>
                  <Text className="text-white text-[26px] font-black leading-none mb-0.5">
                    {m.value}
                    <Text className="text-textSecondary text-[14px] font-medium"> {m.unit}</Text>
                  </Text>
                  <View className="h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <View className="h-full rounded-full" style={{ width: `${m.bar * 100}%`, backgroundColor: m.color }} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Ingredients */}
          <View>
            <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Ingredients</Text>
            <View className="bg-surface border border-white/5 rounded-[28px] px-5 py-4">
              {INGREDIENTS.map((item, i) => (
                <View key={i} className={`flex-row items-center gap-4 py-3.5 ${i < INGREDIENTS.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <View className="w-2 h-2 rounded-full bg-accent" />
                  <Text className="text-white text-[14px] font-semibold">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Prep Steps */}
          <View>
            <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Preparation</Text>
            <View className="gap-3">
              {STEPS.map((step, i) => (
                <View key={i} className="flex-row gap-4">
                  <View className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 items-center justify-center shrink-0 mt-0.5">
                    <Text className="text-primary text-[12px] font-black">{i + 1}</Text>
                  </View>
                  <Text className="text-white/80 text-[14px] leading-relaxed flex-1">{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-background border-t border-white/5">
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient colors={['#22C55E', '#00D4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-[20px] py-5 items-center flex-row justify-center gap-3">
            <CheckCircle2 color="white" size={20} />
            <Text className="text-white font-black text-[17px]">Log This Meal</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
