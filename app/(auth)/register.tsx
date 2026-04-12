import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Register() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-8">
      <Text className="text-3xl font-bold text-purple-700 mb-2">Create Account</Text>
      <Text className="text-gray-500 mb-10 text-center">Start your personalised wellness journey today.</Text>
      {/* TODO: React Hook Form + Zod registration fields */}
      <TouchableOpacity
        className="w-full bg-purple-700 rounded-2xl py-4 items-center mb-4"
        onPress={() => router.replace('/(onboarding)/profile-setup')}
      >
        <Text className="text-white font-semibold">Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-purple-600 text-sm">Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
