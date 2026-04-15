import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { Header } from '@/src/components/ui/Header';
import { Check, Plus, Minus, Droplets, Target } from 'lucide-react-native';

const MEALS = [
  { id: '1', time: '7:30 AM', meal: 'Breakfast', items: 'Oats + Banana + Almond milk', kcal: 380, done: true, img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=300&auto=format&fit=crop' },
  { id: '2', time: '1:00 PM', meal: 'Lunch', items: 'Quinoa bowl + Grilled tofu', kcal: 620, done: true, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop' },
  { id: '3', time: '8:00 PM', meal: 'Dinner', items: 'Lentil soup + Brown rice', kcal: 510, done: false, img: 'https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=300&auto=format&fit=crop' },
];

export default function DietScreen() {
  const consumed = 1420;
  const goal = 2000;

  return (
    <ScreenWrapper>
      <Header title="Nutrition" subtitle="Your personalized fuel" />
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Macro Summary Strip Header */}
        <View className="bg-surface border border-white/5 p-6 rounded-[32px] mt-2">
          <View className="flex-row justify-between items-end mb-6">
             <View>
                <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-1.5">Today's Intake</Text>
                <Text className="text-white text-[32px] font-black">{consumed} <Text className="text-textSecondary text-[16px] font-medium">/ {goal} kcal</Text></Text>
             </View>
             <View className="w-12 h-12 rounded-full bg-accent/10 items-center justify-center">
                <Target color="#22C55E" size={24} />
             </View>
          </View>

          <View className="flex-row gap-2 h-4 rounded-full overflow-hidden bg-black/40 mb-5">
            <View className="h-full bg-[#F472B6]" style={{ width: '40%' }} />
            <View className="h-full bg-[#00D4FF]" style={{ width: '35%' }} />
            <View className="h-full bg-[#EAB308]" style={{ width: '25%' }} />
          </View>

          <View className="flex-row justify-between flex-wrap gap-y-4">
             <View>
               <View className="flex-row items-center gap-2 mb-1">
                 <View className="w-2.5 h-2.5 rounded-full bg-[#F472B6]" />
                 <Text className="text-textSecondary text-[12px] font-bold uppercase">Protein</Text>
               </View>
               <Text className="text-white font-black text-[16px]">75g <Text className="text-textSecondary font-medium text-[13px]">/ 110g</Text></Text>
             </View>
             <View>
               <View className="flex-row items-center gap-2 mb-1">
                 <View className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
                 <Text className="text-textSecondary text-[12px] font-bold uppercase">Carbs</Text>
               </View>
               <Text className="text-white font-black text-[16px]">120g <Text className="text-textSecondary font-medium text-[13px]">/ 180g</Text></Text>
             </View>
             <View>
               <View className="flex-row items-center gap-2 mb-1">
                 <View className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                 <Text className="text-textSecondary text-[12px] font-bold uppercase">Fats</Text>
               </View>
               <Text className="text-white font-black text-[16px]">45g <Text className="text-textSecondary font-medium text-[13px]">/ 60g</Text></Text>
             </View>
          </View>
        </View>

        {/* Hydration Tracker */}
        <View className="bg-surface border border-white/5 p-6 rounded-[32px]">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#00D4FF]/10 items-center justify-center">
                <Droplets color="#00D4FF" size={20} />
              </View>
              <Text className="text-white text-[18px] font-extrabold">Hydration</Text>
            </View>
            <Text className="text-textSecondary text-[14px] font-bold">1.2L / 2.5L</Text>
          </View>
          
          <View className="flex-row justify-between items-center mt-2">
            {[1,2,3,4,5,6,7].map((glass, i) => (
              <View key={i} className={`w-[11%] h-14 rounded-[12px] border ${i < 4 ? 'bg-[#00D4FF]/20 border-[#00D4FF]/40' : 'bg-white/5 border-transparent'}`} />
            ))}
          </View>
        </View>

        {/* MEALS LIST */}
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mt-4 ml-2">Today's Meals</Text>

        {MEALS.map((m) => (
          <TouchableOpacity key={m.id} onPress={() => router.push('/(secondary)/meal-detail' as any)} activeOpacity={0.95}>
            <View className={`bg-surface border border-white/5 rounded-[32px] p-4 flex-row items-center ${m.done ? 'opacity-50' : ''}`}>
              <Image source={{ uri: m.img }} className="w-20 h-20 rounded-[20px]" />
              
              <View className="flex-1 ml-4 justify-center">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-accent text-[12px] font-extrabold uppercase">{m.time}</Text>
                  <Text className="text-textSecondary text-[12px] font-bold">🔥 {m.kcal} kcal</Text>
                </View>
                <Text className="text-textPrimary text-[18px] font-black mb-1">{m.meal}</Text>
                <Text className="text-textSecondary text-[13px]" numberOfLines={1}>{m.items}</Text>
              </View>

              <View className={`w-10 h-10 rounded-full ml-2 items-center justify-center border ${m.done ? 'bg-accent/20 border-accent/40' : 'bg-transparent border-white/10'}`}>
                 {m.done && <Check color="#22C55E" size={20} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
      </ScrollView>
    </ScreenWrapper>
  );
}
