import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function OnboardingHealthAssessment() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-8">
      <Text className="text-2xl font-bold text-gray-900 mb-2">Health Assessment</Text>
      <Text className="text-gray-500 text-center mb-10">
        Tell us about yourself so we can personalise your plan.
      </Text>
      {/* TODO: Render multi-step form using React Hook Form + Zod */}
      <TouchableOpacity
        className="w-full bg-purple-700 rounded-2xl py-4 items-center"
        onPress={() => router.push('/(onboarding)/program-recommendation')}
      >
        <Text className="text-white font-semibold">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
