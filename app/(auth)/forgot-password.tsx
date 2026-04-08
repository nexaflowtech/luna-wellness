import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function ForgotPassword() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-8">
      <Text className="text-2xl font-bold text-gray-900 mb-2">Reset Password</Text>
      <Text className="text-gray-500 text-center mb-10">
        Enter your email and we'll send you a reset link.
      </Text>
      {/* TODO: Email field + Firebase sendPasswordResetEmail */}
      <TouchableOpacity
        className="w-full bg-purple-700 rounded-2xl py-4 items-center mb-4"
        onPress={() => router.back()}
      >
        <Text className="text-white font-semibold">Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
}
