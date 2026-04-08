import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Stethoscope, Activity, Dumbbell, Calendar, Heart, LineChart, Leaf } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SelectionCard } from '@/src/components/onboarding/SelectionCard';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';
import { useAuth } from '@/src/context/AuthContext';
import { useUser } from '@/src/context/UserContext';
import { generateAssessment, saveAssessment, saveQuestionnaire } from '@/src/services/onboardingService';

const GOAL_LIBRARY = [
  {
    id: 'pcos',
    title: 'PCOD / PCOS Support',
    desc: 'Personalized support for hormone and metabolic balance.',
    icon: Stethoscope,
    recommended: true
  },
  {
    id: 'thyroid',
    title: 'Thyroid Support',
    desc: 'Focus on optimizing iodine and selenium intake while monitoring temperature patterns.',
    icon: Activity,
    recommended: false
  },
  {
    id: 'weight',
    title: 'Weight Loss',
    desc: 'Strategic movement and nutrition plans for sustainable fat loss.',
    icon: Dumbbell,
    recommended: false
  },
  {
    id: 'cycle',
    title: 'Cycle Regularity',
    desc: 'Address spotting, irregular lengths, or missing periods through nutrient-dense protocols.',
    icon: Calendar,
    recommended: true
  },
  {
    id: 'skin',
    title: 'Skin Health',
    desc: 'Target hormonal acne and skin elasticity by synchronizing your skincare active ingredients.',
    icon: Heart,
    recommended: false
  },
  {
    id: 'strength',
    title: 'Strength Gain',
    desc: 'Build lean muscle and improve stamina.',
    icon: Dumbbell,
    recommended: false
  },
  {
    id: 'heart',
    title: 'Heart Health',
    desc: 'Improve cardio endurance and recovery.',
    icon: Heart,
    recommended: false
  },
  {
    id: 'stress',
    title: 'Stress Management',
    desc: 'Lower stress and improve sleep quality.',
    icon: LineChart,
    recommended: false
  },
  {
    id: 'hormone',
    title: 'Hormone Balance',
    desc: 'Build personalized endocrine support.',
    icon: Activity,
    recommended: false
  },
  {
    id: 'wellness',
    title: 'General Wellness',
    desc: 'Daily habits for long-term health.',
    icon: Leaf,
    recommended: false
  },
];

export default function QuestionnaireScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['pcos', 'cycle']);
  const [cycleInfo, setCycleInfo] = useState('Regular 28-day cycle');
  const [dietPreference, setDietPreference] = useState('Vegetarian');
  const [lifestyle, setLifestyle] = useState('High stress, poor sleep');
  const [loading, setLoading] = useState(false);
  const userGoals = profile?.goals ?? [];
  const questionnaireGoals = userGoals.length
    ? GOAL_LIBRARY.filter((goal) => userGoals.includes(goal.id))
    : GOAL_LIBRARY.slice(0, 5);

  React.useEffect(() => {
    if (profile?.goals && profile.goals.length > 0) {
      setSelectedGoals(profile.goals);
    }
  }, [profile?.goals]);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => 
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    if (selectedGoals.length === 0) {
      Alert.alert('Choose goals', 'Please select at least one health focus.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cycleInfo,
        dietPreference,
        lifestyleHabits: lifestyle.split(',').map((v) => v.trim()).filter(Boolean),
        primaryGoals: selectedGoals,
      };
      await saveQuestionnaire(user.uid, payload);
      const assessment = generateAssessment(payload);
      await saveAssessment(user.uid, assessment);
      router.push('/(onboarding)/risk-score');
    } catch {
      Alert.alert('Save failed', 'Could not save questionnaire.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="w-full flex-row items-center justify-between px-6 pt-4 mb-2">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="w-8 h-8 rounded-full flex items-center justify-center">
             <ArrowLeft color="#181b27" size={24} />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-lg tracking-tight text-primary">
            Health Goals
          </Text>
        </View>
        <View className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/15">
          {/* Dummy user profile avatar if needed, otherwise empty */}
          <Image 
             source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2oDUkjmE5zxCeODlr6nqoax8K8GYUoDouCzKSUUMbnn7V5ASWtWQbcoOkhMFgUo3rRO97T1xzVCLnoM-PLAw3EgP3RsGICIfrI4IpVuk2EPUWQT3ZDR7gnG3lTLHUdaD3N6Q-uW_-48wmz32Avo-BGiv6VLhXAXNyJTEKGMPstkOg2i4prG4HfZZov0ZI46ExWv6psAw_zpoO8uIb_-clr1aCm6_2SqzvRdLAMV0cdov0rdJhMVzkam_9_M5a8GYW6j3DFGyzF4s' }} 
             className="w-full h-full object-cover" 
          />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 160, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <ProgressIndicator currentStep={3} totalSteps={4} />

        <View className="mb-10">
          <Text className="font-headline text-3xl font-extrabold tracking-tight mb-3 text-on-surface">
            Refine your focus
          </Text>
          <Text className="text-on-surface-variant leading-relaxed text-lg">
            Select the primary areas where you want Luna to tailor your daily insights.
          </Text>
        </View>

        <View className="w-full">
          {questionnaireGoals.map((goal) => {
            const IconComp = goal.icon;
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <SelectionCard
                key={goal.id}
                title={goal.title}
                description={goal.desc}
                icon={<IconComp color={isSelected ? '#ffffff' : '#b7004e'} size={24} strokeWidth={1.5} />}
                isSelected={isSelected}
                isRecommended={goal.recommended}
                onToggle={() => toggleGoal(goal.id)}
              />
            );
          })}
        </View>

        <View className="mt-8 gap-3">
          <TextInput
            value={cycleInfo}
            onChangeText={setCycleInfo}
            placeholder="Cycle info"
            placeholderTextColor="#8f6f74"
            className="bg-surface-container-high rounded-2xl px-4 py-4 text-on-surface"
          />
          <TextInput
            value={dietPreference}
            onChangeText={setDietPreference}
            placeholder="Diet preference"
            placeholderTextColor="#8f6f74"
            className="bg-surface-container-high rounded-2xl px-4 py-4 text-on-surface"
          />
          <TextInput
            value={lifestyle}
            onChangeText={setLifestyle}
            placeholder="Lifestyle habits (comma separated)"
            placeholderTextColor="#8f6f74"
            className="bg-surface-container-high rounded-2xl px-4 py-4 text-on-surface"
          />
        </View>

        <View className="mt-12 p-8 bg-surface-container-low rounded-xl relative overflow-hidden">
          <View className="relative z-10">
            <Text className="font-headline font-bold text-lg mb-2 text-on-surface">
              Scientific Integrity
            </Text>
            <Text className="text-sm text-on-surface-variant leading-relaxed">
              Luna's protocols are developed by leading endocrinologists. These selections modify your baseline physiological model.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 p-6 pt-16 bg-gradient-to-t from-surface/90 via-surface/90 to-transparent flex flex-col gap-4">
         <TouchableOpacity 
            activeOpacity={0.8} 
            className="w-full"
            onPress={handleSave}
         >
            <LinearGradient
              colors={['#b7004e', '#e21364']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-14 rounded-full flex-row items-center justify-center gap-2 shadow-xl"
            >
              <Text className="text-white font-headline font-bold text-lg">
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </LinearGradient>
         </TouchableOpacity>
         
         <TouchableOpacity className="w-full py-2" onPress={handleSave}>
            <Text className="text-on-surface-variant font-medium text-sm text-center transition-colors">
                Skip to final step
            </Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
