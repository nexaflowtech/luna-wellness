import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Target, TrendingDown, Sparkles } from 'lucide-react-native';

export default function PlanReadyScreen() {
  const router = useRouter();
  const { aiPlan, goals } = useLocalSearchParams();
  const planData = aiPlan ? JSON.parse(aiPlan as string) : null;
  const primaryGoal = planData?.summary?.primaryFocus || goals || 'Weight Loss & Toning';

  const handleStart = () => { router.replace('/(tabs)'); };

  const ListItem = ({ text }: { text: string }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <CheckCircle2 color="#6EE7B7" size={20} />
      <Text style={{ color: '#F1F5F9', fontSize: 16, marginLeft: 12 }}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#080B14' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>

        {/* Hero */}
        <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 40 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: 'rgba(110,231,183,0.1)' }}>
            <Sparkles color="#6EE7B7" size={38} />
          </View>
          <Text style={{ color: '#F1F5F9', fontSize: 30, fontWeight: '900', textAlign: 'center', marginBottom: 12 }}>Your Plan is Ready</Text>
          <Text style={{ color: '#64748B', fontSize: 15, textAlign: 'center' }}>
            We've analyzed your profile and crafted a customized protocol to hit your targets safely and efficiently.
          </Text>
        </View>

        {/* Gradient border card */}
        <LinearGradient
          colors={['#6EE7B7', '#818CF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 1, borderRadius: 24, marginBottom: 24 }}
        >
          <View style={{ backgroundColor: '#080B14', borderRadius: 23, padding: 24 }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <Target color="#818CF8" size={22} />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700', marginBottom: 4 }}>Primary Goal</Text>
                <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: 'bold' }}>{primaryGoal}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <TrendingDown color="#6EE7B7" size={22} />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700', marginBottom: 4 }}>Expected Result</Text>
                <Text style={{ color: '#6EE7B7', fontSize: 17, fontWeight: 'bold' }}>See progress in 14–21 days</Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />

            <Text style={{ color: '#64748B', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700', marginBottom: 16 }}>What's Included</Text>
            <ListItem text="Personalized Workout Routine" />
            <ListItem text="Adaptive Nutrition Framework" />
            <ListItem text="24/7 AI Coach Access" />
          </View>
        </LinearGradient>

      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36, backgroundColor: '#080B14', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleStart}>
          <LinearGradient colors={['#6EE7B7', '#818CF8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 16, borderRadius: 100, alignItems: 'center' }}>
            <Text style={{ color: '#080B14', fontWeight: '800', fontSize: 17 }}>Start My Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
